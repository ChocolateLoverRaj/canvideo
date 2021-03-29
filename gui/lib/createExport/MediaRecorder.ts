import { ExportTypes, RecorderExportStates } from '../../states/Exports'
import createCanvas from '../createCanvas'
import { CreateFn } from './types'

const createExportMediaRecorder: CreateFn = (frames, fps, width, height) => {
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

export default createExportMediaRecorder
