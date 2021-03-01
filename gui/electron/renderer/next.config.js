const nextTranspileModules = require('next-transpile-modules')

module.exports = nextTranspileModules(['gui'])({
  webpack: (config) => Object.assign(config, {
    target: 'electron-renderer'
  })
})
