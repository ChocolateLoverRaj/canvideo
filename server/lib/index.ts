import express from 'express'

const server = express()

server.get('/', async (req, res) => {
    res.sendStatus(503)
})

const port = process.env.PORT || 2990
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
