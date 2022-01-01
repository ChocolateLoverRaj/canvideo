module.exports = {
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
  ],
  webpack: config => {
    config.module.rules.push({
      test: /\.txt/,
      type: 'asset/source'
    })
    return config
  }
}
