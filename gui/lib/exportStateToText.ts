import { ExportStates } from '../states/Exports'

const exportStateToText = (exportState: ExportStates): string => {
  switch (exportState) {
    case ExportStates.COMPLETE:
      return 'Complete'
    case ExportStates.RECORDING_FRAME:
      return 'Recording frame'
    case ExportStates.WAITING_FOR_DATA:
      return 'Waiting for video data'
    case ExportStates.WAITING_FOR_ANIMATION_FRAME:
      return 'Waiting for animation frame'
  }
}

export default exportStateToText
