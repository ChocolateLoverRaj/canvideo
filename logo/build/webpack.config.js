module.exports = {
  mode: 'development',
  entry: './build/build.tsx',
  output: {
    path: __dirname,
    filename: 'build.js'
  },
  target: 'node',
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx/,
        loader: 'ts-loader'
      }
    ]
  }
}
