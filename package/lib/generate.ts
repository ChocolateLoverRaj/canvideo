import { Operations } from './operations'
import NP from 'number-precision'

export type VideoFn = (t: number) => Array<Operations> | null

export default (videoFn: VideoFn, fps: number): Array<Array<Operations>> => {
    NP.enableBoundaryChecking(false)

    const spf = 1 / fps
    const frames: Array<Array<Operations>> = []
    let t = 0
    while (true) {
        const frame = videoFn(parseFloat(t.toFixed(10)))
        if (frame) {
            frames.push(frame)
            t = NP.plus(t, spf)
        } else {
            break
        }
    }
    return frames
}
