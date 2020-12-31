import generate, { VideoFn } from './generate'
import generateMp4, { Options } from './generate-mp4'
import { join } from 'path'

const videoFn: VideoFn = t => {
    if (t >= 2) return null
    return [['fillRect', [t * 50, t * 50, 100, 100]]]
}

const frames = generate(videoFn, 5)

const options: Options = {
    width: 200,
    height: 200,
    outputFile: join(__dirname, '../examples/square.mp4'),
    tempDir: join(__dirname, '../temp')
}
generateMp4(frames, options).then(() => {
    console.log('done')
})
