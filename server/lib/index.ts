import validate from './validate'
import express, { Router, json } from 'express'
import { readFile } from 'jsonfile'
import { join } from 'path'

const server = express()

server.get('/', async (req, res) => {
    res.sendStatus(503)
})

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

const api = Router()
server.use('/api/v3', api)

api.post('/', json(), validate(postSchema), async (req, res) => {
    res.sendStatus(201)
})

const port = process.env.PORT || 2990
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
