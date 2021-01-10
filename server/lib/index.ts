import validate from './validate'
import newId from './id'
import accept from './accept'
import express, { json } from 'express'
import { readFile } from 'jsonfile'
import generate from 'canvideo/dist/generate-mp4'
import { join } from 'path'
import { ensureDir, emptyDir } from 'fs-extra'
import { promises as fs } from 'fs'

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
  if (req.headers.referer) {
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
  state: PromiseStates,
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

server.post('/', json(), validate(postSchema), async (req, res) => {
  const videoId = newId()
  res.status(202).json({ id: videoId })
  await ensureDirs
  const outputFile = join(outputDir, `${videoId}.mp4`)
  videos.set(videoId, getState</* eslint-disable @typescript-eslint/no-invalid-void-type */number/* eslint-enable @typescript-eslint/no-invalid-void-type */>(generate(
    req.body.frames, {
    fps: req.body.fps,
    width: req.body.width,
    height: req.body.height,
    outputFile: outputFile,
    tempDir: tempDir,
    prefix: videoId
  })
    .then(() => fs.stat(outputFile))
    .then(({ size }) => size)
  ))
})

server.get('/:id', (req, res, next) => {
  const video = videos.get(parseInt(req.params.id))
  if (video === undefined) {
    res.sendStatus(404)
    return
  }
  accept()
    .mp4((req, res) => {
      if (video.state === PromiseStates.PENDING) {
        res.sendStatus(425)
        return
      }
      if (video.state === PromiseStates.REJECTED) {
        res.sendStatus(424)
        return
      }
      res.end(video.value?.toString())
    })
    .json((req, res) => {
      res.json({
        state: video.state
      })
    })
    (req, res, next)
})

const port = process.env.PORT ?? 2990
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
