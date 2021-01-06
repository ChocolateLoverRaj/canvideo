import validate from '../validate'
import id from '../id'
import { Router, json } from 'express'
import { readFile } from 'jsonfile'
import { join } from 'path'

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

api.post('/', json(), validate(postSchema), async (req, res) => {
    res.end(`Id: ${id.currentId++}`)
})

export default api
