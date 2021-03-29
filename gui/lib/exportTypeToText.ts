import { ExportTypes } from '../states/Exports'

const exportTypeToText = (exportType: ExportTypes): string => {
  switch (exportType) {
    case ExportTypes.MEDIA_RECORDER:
      return 'MediaRecorder'
    case ExportTypes.FFMPEG:
      return 'in browser FFmpeg'
    default:
      return 'webm writer'
  }
}

export default exportTypeToText
