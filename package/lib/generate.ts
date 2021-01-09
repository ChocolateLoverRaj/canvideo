import { Operations } from './operations'
import NP from 'number-precision'

export type VideoFn = (t: number) => Operations[] | null

export default (videoFn: VideoFn, fps: number): Operations[][] => {
  NP.enableBoundaryChecking(false)

  const spf = 1 / fps
  const frames: Operations[][] = []
  let t = 0
  while (true) {
    const frame = videoFn(parseFloat(t.toFixed(10)))
    if (frame !== null) {
      frames.push(frame)
      t = NP.plus(t, spf)
    } else {
      break
    }
  }
  return frames
}
