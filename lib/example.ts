import generate, { VideoFn } from './generate'

const videoFn: VideoFn = t => {
    return [['rectangle', [1, 2, 3, 4]]]
}

generate(videoFn)
