import { Operations } from 'canvideo/lib/operations'

export enum ExportStates {
  WAITING_FOR_ANIMATION_FRAME,
  RECORDING_FRAME,
  COMPLETE
}

interface BaseExport {
  canvas: HTMLCanvasElement
  recorder: any
  state: ExportStates
  fps: number
  frames: Operations[][]
  currentFrame: number
}

interface WaitingExport extends BaseExport {
  state: ExportStates.WAITING_FOR_ANIMATION_FRAME
}

interface RecordingExport extends BaseExport {
  state: ExportStates.RECORDING_FRAME
  startTime: number
}

interface CompleteExport extends BaseExport{
  state: ExportStates.COMPLETE
}

export type Export = WaitingExport | RecordingExport | CompleteExport

export type Exports = Set<Export>
