module.exports = {
  headers: async () => [
    {
      source: '/ffmpeg',
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
}