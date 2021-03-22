import { Operations } from 'canvideo/lib/operations'

enum ExportStates {
  WAITING_FOR_ANIMATION_FRAME,
  RECORDING_FRAME,
  COMPLETE
}

interface BaseExport {
  canvas: HTMLCanvasElement
  recorder: any
  state: ExportStates
  fps: number
}

interface IncompleteExport extends BaseExport {
  upcomingFrames: Operations[][]
}

interface WaitingExport extends IncompleteExport {
  state: ExportStates.WAITING_FOR_ANIMATION_FRAME
}

interface RecordingExport extends IncompleteExport {
  state: ExportStates.RECORDING_FRAME
  startTime: number
}

interface CompleteExport extends BaseExport{
  state: ExportStates.COMPLETE
}

type Export = WaitingExport | RecordingExport | CompleteExport

export type Exports = Set<Export>
