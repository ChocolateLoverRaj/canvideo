import { Operations } from 'canvideo/lib/operations'
import { ExportTypes, Export } from '../../states/Exports'
import createExportFfmpeg from './Ffmpeg'
import createExportMediaRecorder from './MediaRecorder'
import { CreateFn } from './types'
import createExportWebm from './Webm'

type CreateMap = {
  [T in ExportTypes]: CreateFn
}

const createMap: CreateMap = {
  [ExportTypes.FFMPEG]: createExportFfmpeg,
  [ExportTypes.MEDIA_RECORDER]: createExportMediaRecorder,
  [ExportTypes.WEBM_WRITER]: createExportWebm
}

const createExport = (
  frames: Operations[][],
  fps: number,
  width: number,
  height: number,
  type: ExportTypes
): Export => createMap[type](frames, fps, width, height)

export default createExport
