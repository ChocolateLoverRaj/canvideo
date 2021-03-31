const withTranspile = require('next-transpile-modules')

module.exports = withTranspile(['@chocolateloverraj/react-json-input'])({
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp'
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin'
        }
      ]
    }
  ]
})
