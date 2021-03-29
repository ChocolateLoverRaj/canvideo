import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { Operations } from 'canvideo/lib/operations'
import { ExportTypes, FfmpegExport, FfmpegExportStates } from '../../states/Exports'

const createExportFfmpeg = (frames: Operations[][], fps: number, width: number, height: number): FfmpegExport => {
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
