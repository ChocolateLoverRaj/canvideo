import { Operations } from 'canvideo/lib/operations'
import ExportObj from '../../mobx/ExportObj'
import ExportTypes from '../../types/ExportTypes'
import FfmpegExport from './FfmpegExport'
import WebmWriterExport from './WebmWriterExport'

export type Export = FfmpegExport | WebmWriterExport

type CreateMap = {
  [T in ExportTypes]: {
    new (
      frames: Operations[][],
      fps: number,
      width: number,
      height: number
    )
  }
}

const createMap: CreateMap = {
  [ExportTypes.FFMPEG]: FfmpegExport,
  [ExportTypes.WEBM_WRITER]: WebmWriterExport
}

const createExport = (
  frames: Operations[][],
  fps: number,
  width: number,
  height: number,
  type: ExportTypes
): ExportObj => ({
  type,
  e: new createMap[type](frames, fps, width, height)
})

export default createExport
