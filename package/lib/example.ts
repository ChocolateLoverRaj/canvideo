import generate, { VideoFn } from './generate'
import generateMp4, { Options } from './generate-mp4'
import { join } from 'path'

const videoFn: VideoFn = t => {
  if (t >= 5) return null
  return [
    ['setFillStyle', ['blue']],
    ['fillRect', [t * 20, t * 20, 100, 100]]
  ]
}

const frames = generate(videoFn, 24)

const options: Options = {
  fps: 24,
  width: 200,
  height: 200,
  outputFile: join(__dirname, '../examples/square.mp4'),
  tempDir: join(__dirname, '../temp'),
  prefix: 'amazing'
}
generateMp4(frames, options)
  .then(() => {
    console.log('done')
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
