import { Operations } from 'canvideo/lib/operations'
import { ExportTypes, RecorderExport, RecorderExportStates } from '../states/Exports'
import createCanvas from './createCanvas'

const createExport = (frames: Operations[][], fps: number, width: number, height: number): RecorderExport => {
  const canvas = createCanvas(width, height)
  const stream = (canvas as any).captureStream(0)
  const recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm'
  })
  recorder.start()
  recorder.pause()
  const [track] = stream.getVideoTracks()
  return {
    type: ExportTypes.MEDIA_RECORDER,
    data: {
      canvas,
      fps,
      recorder,
      state: RecorderExportStates.WAITING_FOR_ANIMATION_FRAME,
      frames,
      currentFrame: 0,
      width,
      height,
      track
    }
  }
}

export default createExport
