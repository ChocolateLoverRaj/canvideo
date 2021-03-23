import { Operations } from 'canvideo/lib/operations'

export enum ExportStates {
  WAITING_FOR_ANIMATION_FRAME,
  RECORDING_FRAME,
  WAITING_FOR_DATA,
  COMPLETE
}

interface BaseExport {
  canvas: HTMLCanvasElement
  recorder: any
  state: ExportStates
  fps: number
  frames: Operations[][]
  currentFrame: number
  width: number
  height: number
  track: any
  url?: string
}

interface WaitingExport extends BaseExport {
  state: ExportStates.WAITING_FOR_ANIMATION_FRAME
}

export interface RecordingExport extends BaseExport {
  state: ExportStates.RECORDING_FRAME
  startTime: number
}

interface WaitingDataExport extends BaseExport {
  state: ExportStates.WAITING_FOR_DATA
}

interface CompleteExport extends BaseExport{
  state: ExportStates.COMPLETE
  url: string
}

export type Export = WaitingExport | RecordingExport | WaitingDataExport | CompleteExport

export type Exports = Set<Export>
