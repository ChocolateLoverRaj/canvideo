import { Operations } from 'canvideo/lib/operations'
import { Export, ExportStates } from '../states/Exports'
import createCanvas from './createCanvas'

const createExport = (frames: Operations[][], fps: number, width: number, height: number): Export => {
  const canvas = createCanvas(width, height)
  const stream = (canvas as any).captureStream(0)
  const recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm'
  })
  recorder.start()
  recorder.pause()
  const [track] = stream.getVideoTracks()
  return {
    canvas,
    fps,
    recorder,
    state: ExportStates.WAITING_FOR_ANIMATION_FRAME,
    frames,
    currentFrame: 0,
    width,
    height,
    track
  }
}

export default createExport
