import ExportTypes from '../types/ExportTypes'

const exportTypeToText = (exportType: ExportTypes): string =>
  exportType === ExportTypes.WEBM_WRITER
    ? 'webm writer'
    : 'in browser FFmpeg'

export default exportTypeToText
