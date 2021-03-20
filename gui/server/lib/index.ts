import validate from './validate'
import newId from './id'
import express, { json, Request, RequestHandler } from 'express'
import { readFile } from 'jsonfile'
import generate from 'canvideo/dist/generate-mp4'
import { join } from 'path'
import { ensureDir, emptyDir } from 'fs-extra'
import { promises as fs, createReadStream } from 'fs'
import never from 'never'

const server = express()

const postSchema = (async () => ({
  type: 'object',
  properties: {
    fps: {
      type: 'number',
      exclusiveMinimum: 0,
      maximum: 60
    },
    width: {
      type: 'number',
      exclusiveMinimum: 0,
      maximum: 1000,
      multipleOf: 2
    },
    height: {
      type: 'number',
      exclusiveMinimum: 0,
      maximum: 1000,
      multipleOf: 2
    },
    frames: {
      type: 'array',
      items: {
        type: 'array',
        items: await readFile(join(__dirname, '../node_modules/canvideo/dist/operations.schema.json')),
        maxItems: 1000
      },
      minItems: 1,
      maxItems: 1000
    }
  },
  required: ['fps', 'width', 'height', 'frames']
}))()

// Make sure dirs are setup
const generatedDir = join(__dirname, '../generated')
const outputDir = join(generatedDir, 'output')
const tempDir = join(generatedDir, 'temp')
const ensureDirs = ensureDir(generatedDir).then(async () => await Promise.all([
  emptyDir(outputDir),
  emptyDir(tempDir)
]))

// Set Access-Control headers for all requests
server.use(async (req, res, next) => {
  // This will allow requests from cross-origin
  if (req.headers.referer !== undefined) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.referer.slice(0, -1))
  }
  // This will allow json requests
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// Get the state of a promise
enum PromiseStates {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}
interface StateObj<T> {
  promise: Promise<T>
  state: PromiseStates
  value?: T
}
const getState = <T>(promise: Promise<T>): StateObj<T> => {
  const stateObj: StateObj<T> = {
    promise: promise,
    state: PromiseStates.PENDING
  }
  promise
    .then(v => {
      stateObj.state = PromiseStates.RESOLVED
      stateObj.value = v
    })
    .catch(() => {
      stateObj.state = PromiseStates.REJECTED
    })
  return stateObj
}

// Map of videos
const videos = new Map<number, StateObj<number>>()

// Get a video path from id
const getVideoPath = (id: string | number): string => join(outputDir, `${id}.mp4`)

server.post('/', json(), validate(postSchema), async (req, res) => {
  const videoId = newId()
  res.status(202).json({ id: videoId })
  await ensureDirs
  const outputFile = getVideoPath(videoId)
  videos.set(videoId, getState<number>(generate(
    req.body.frames, {
      fps: req.body.fps,
      width: req.body.width,
      height: req.body.height,
      outputFile: outputFile,
      tempDir: tempDir,
      prefix: videoId
    })
    .then(async () => await fs.stat(outputFile))
    .then(({ size }) => size)
  ))
})

// Maximum / default chunk size
const chunkSize =
  // Byte
  256 *
  // Kilobyte
  1024 *
  // About half a megabyte
  512

const getVideo = (req: Request): StateObj<number> | undefined => {
  const id = req.query.id
  if (typeof id !== 'string') return
  const video = videos.get(parseInt(id))
  return video
}

const videoMiddleware: RequestHandler = (req, res, next) => {
  if (getVideo(req) === undefined) {
    res.sendStatus(404)
    return
  }
  next()
}

server.use('/progress', videoMiddleware)
server.get('/progress', (req, res) => {
  const video = getVideo(req) as StateObj<number>
  res.json({
    state: video.state
  })
})

server.use('/output', videoMiddleware)
server.get('/output', (req, res) => {
  const video = getVideo(req) as StateObj<number>
  if (video.state === PromiseStates.PENDING) {
    res.sendStatus(425)
    return
  }
  if (video.state === PromiseStates.REJECTED) {
    res.sendStatus(424)
    return
  }
  // The last 'end' byte
  const lastByte = video.value as number - 1
  let [start, end] = req.headers.range?.split('=')[1]?.split('-').map(str => parseInt(str)) ?? []
  if (Number.isInteger(start)) {
    if (Number.isInteger(end)) {
      // Make sure end is after start and end doesn't go past last video byte
      if (end <= start || start + end > lastByte) {
        res.sendStatus(416)
        return
      }
      // Limit chunk size
      end = start + Math.min(end - start, chunkSize)
    } else {
      // Give chunk size
      end = Math.min(start + chunkSize, lastByte)
    }
  } else {
    // Start at zero, with chunk size
    start = 0
    end = Math.min(chunkSize, lastByte)
  }
  // Set necessary headers
  res.setHeader('Content-Type', 'video/mp4')
  // TODO: calculate content duration
  // res.setHeader('Content-Duration', )
  res.setHeader('Content-Length', (end - start) + 1)
  res.setHeader('Content-Range', `bytes ${start}-${end}/${video.value ?? never('No video byte length')}`)
  res.setHeader('Accept-Ranges', 'bytes')
  createReadStream(getVideoPath(req.query.id as string), { start, end })
    .pipe(res)
})

const port = process.env.PORT ?? 2990
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
