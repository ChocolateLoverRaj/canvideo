import { Operations } from 'canvideo/lib/operations'

export enum RecorderExportStates {
  WAITING_FOR_ANIMATION_FRAME,
  RECORDING_FRAME,
  WAITING_FOR_DATA,
  COMPLETE
}

interface RecorderBaseExport {
  canvas: HTMLCanvasElement
  recorder: any
  state: RecorderExportStates
  fps: number
  frames: Operations[][]
  currentFrame: number
  width: number
  height: number
  track: any
  url?: string
}

interface RecorderWaitingExport extends RecorderBaseExport {
  state: RecorderExportStates.WAITING_FOR_ANIMATION_FRAME
}

export interface RecorderRecordingExport extends RecorderBaseExport {
  state: RecorderExportStates.RECORDING_FRAME
  startTime: number
}

interface RecorderWaitingDataExport extends RecorderBaseExport {
  state: RecorderExportStates.WAITING_FOR_DATA
}

interface RecorderCompleteExport extends RecorderBaseExport{
  state: RecorderExportStates.COMPLETE
  url: string
}

export type RecorderExportData = RecorderWaitingExport | RecorderRecordingExport | RecorderWaitingDataExport | RecorderCompleteExport

export enum ExportTypes {
  MEDIA_RECORDER,
  FFMPEG
}

interface BaseExport {
  type: ExportTypes
  data: any
}

export interface RecorderExport extends BaseExport {
  type: ExportTypes.MEDIA_RECORDER
  data: RecorderExportData
}

type Export = RecorderExport

export type Exports = Set<Export>
