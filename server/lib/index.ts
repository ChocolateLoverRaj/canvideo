import express, { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { readFile } from 'jsonfile'
import valid from 'semver/ranges/valid'
import maxSatisfying from 'semver/ranges/max-satisfying'
import { join, basename } from 'path'
import { promises as fs } from 'fs'

const server = express()

server.get('/', async (req, res) => {
    res.sendStatus(503)
})

// List of deprecated versions
const deprecated = readFile(join(__dirname, '../deprecated-apis.json'))

const apisDir = join(__dirname, './apis')

// List of non deprecated apis
const apis = fs.readdir(apisDir)
    .then(dirs => dirs.map(dir => basename(dir, '.js')))

// Check for the api version
interface VersionParams extends ParamsDictionary {
    version: string
}

const versionHandler: RequestHandler<VersionParams> = async (req, res, next) => {
    const range = req.params.version
    const cleanRange = valid(range)
    if (!cleanRange) {
        res.status(400).end(`Invalid semver range: ${range}`)
        return
    }
    const version = maxSatisfying(await apis, range)
    if (!version) {
        const version = maxSatisfying(await deprecated, range)
        if (!version) {
            res.status(404).end(`Couldn't find an api version for ${cleanRange} (original range: ${range})`)
            return
        }
        res.status(410).end(`The latest api you requested: ${version} is deprecated and is no longer served.`)
        return
    }
    const { default: api } = require(join(apisDir, `${version}.js`))
    api(req, res, next)
}
server.use('/api/:version', versionHandler)

const port = process.env.PORT || 2990
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
