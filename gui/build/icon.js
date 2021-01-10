const jsonfile = require('jsonfile')
const { join } = require('path')

const filePath = join(__dirname, '../public/site.webmanifest')

const site = jsonfile.readFileSync(filePath)

site.name = 'Canvideo'
site.short_name = 'Canvideo'

jsonfile.writeFileSync(filePath, site, { spaces: 2 })
