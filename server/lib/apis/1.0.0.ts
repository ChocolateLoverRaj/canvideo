import validate from '../validate'
import newId from '../id'
import { Router, json } from 'express'
import { readFile } from 'jsonfile'
import generate from 'canvideo/dist/generate-mp4'
import { join } from 'path'
import { ensureDir, emptyDir } from 'fs-extra'

const api = Router()

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
                items: await readFile(join(__dirname, '../../node_modules/canvideo/dist/operations.schema.json')),
                maxItems: 1000
            },
            minItems: 1,
            maxItems: 1000
        }
    },
    required: ['fps', 'width', 'height', 'frames']
}))()

// Make sure dirs are setup
const generatedDir = join(__dirname, '../../generated')
const outputDir = join(generatedDir, 'output')
const tempDir = join(generatedDir, 'temp')
const ensureDirs = ensureDir(generatedDir).then(async () => await Promise.all([
    emptyDir(outputDir),
    emptyDir(tempDir)
]))

// Get the state of a promise
enum PromiseStates {
    PENDING = 'pending',
    RESOLVED = 'resolved',
    REJECTED = 'rejected'
}
interface StateObj<T> {
    promise: Promise<T>,
    state: PromiseStates
}
const getState = <T>(promise: Promise<T>): StateObj<T> => {
    const stateObj: StateObj<T> = {
        promise: promise,
        state: PromiseStates.PENDING
    }
    promise
        .then(() => {
            stateObj.state = PromiseStates.RESOLVED
        })
        .catch(() => {
            stateObj.state = PromiseStates.REJECTED
        })
    return stateObj
}

// Map of videos
const videos = new Map<number, StateObj<void>>()

api.post('/', json(), validate(postSchema), async (req, res) => {
    const videoId = newId()
    res.status(202).json({ id: videoId })
    await ensureDirs
    videos.set(videoId, getState<void>(generate(req.body.frames, {
        fps: req.body.fps,
        width: req.body.width,
        height: req.body.height,
        outputFile: join(outputDir, `${videoId}.mp4`),
        tempDir: tempDir,
        prefix: videoId
    })))
})

api.get('/:id', (req, res) => {
    const video = videos.get(parseInt(req.params.id))
    if (!video) {
        res.sendStatus(404)
        return
    }
    res.json({
        state: video.state
    })
})

export default api
