import { RecorderExportStates } from '../types/ExportTypes'

const exportStateToText = (exportState: RecorderExportStates): string => {
  switch (exportState) {
    case RecorderExportStates.COMPLETE:
      return 'Complete'
    case RecorderExportStates.RECORDING_FRAME:
      return 'Recording frame'
    case RecorderExportStates.WAITING_FOR_DATA:
      return 'Waiting for video data'
    case RecorderExportStates.WAITING_FOR_ANIMATION_FRAME:
      return 'Waiting for animation frame'
  }
}

export default exportStateToText
