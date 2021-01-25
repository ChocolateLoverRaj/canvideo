const fsExtra = require('fs-extra')
const path = require('path')
fsExtra.emptyDirSync(path.join(__dirname, '../dist'))
