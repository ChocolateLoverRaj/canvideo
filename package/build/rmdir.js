const fs = require('fs')
const path = require('path')
try {
  fs.rmSync(path.join(__dirname, '../dist'), { recursive: true })
} catch (e) {
  if (e.code !== 'ENOENT') {
    throw e
  }
}
