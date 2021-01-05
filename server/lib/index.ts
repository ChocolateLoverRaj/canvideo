import validate from './validate'
import express, { Router, json } from 'express'
import { readFile } from 'jsonfile'
import { join } from 'path'

const server = express()

server.get('/', async (req, res) => {
    res.sendStatus(503)
})

const operationsSchema = readFile(join(__dirname, '../node_modules/canvideo/dist/operations.schema.json'))

const api = Router()
server.use('/api/v2', api)

api.post('/', json(), validate(operationsSchema), async (req, res) => {
    res.json(200)
})

const port = process.env.PORT || 2990
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
