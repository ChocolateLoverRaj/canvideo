import express from 'express'
import { readFile } from 'jsonfile'
import { join } from 'path'

const server = express()

server.get('/', async (req, res) => {
    res.sendStatus(503)
})

const operationsSchema = readFile(join(__dirname, '../node_modules/canvideo/dist/operations.schema.json'))

server.get('/api/v1', async (req, res) => {
    res.json(await operationsSchema)
})

const port = process.env.PORT || 2990
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
