import { Operations } from 'canvideo/lib/operations'
import { ExportTypes, Export } from '../../states/Exports'
import createExportFfmpeg from './Ffmpeg'
import createExportMediaRecorder from './MediaRecorder'

const createExport = (
  frames: Operations[][],
  fps: number,
  width: number,
  height: number,
  type: ExportTypes
): Export => {
  switch (type) {
    case ExportTypes.MEDIA_RECORDER:
      return createExportMediaRecorder(frames, fps, width, height)
    case ExportTypes.FFMPEG:
      return createExportFfmpeg(frames, fps, width, height)
  }
}

export default createExport
