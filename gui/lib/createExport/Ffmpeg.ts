import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { ExportTypes, FfmpegExportStates } from '../../states/Exports'
import { CreateFn } from './types'

const createExportFfmpeg: CreateFn = (frames, fps, width, height) => {
  const ffmpeg = createFFmpeg()

  return {
    type: ExportTypes.FFMPEG,
    data: {
      state: FfmpegExportStates.LOADING_FFMPEG,
      frames: frames,
      completedFrames: 0,
      ffmpeg,
      fps,
      width,
      height,
      id: Math.random(),
      loadPromise: ffmpeg.load(),
      generateProgress: 0
    }
  }
}

export default createExportFfmpeg
