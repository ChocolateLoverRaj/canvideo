import { FC } from 'react'
import { ExportTypes } from '../../states/Exports'
import { ExportCommonProps } from './Common'
import ExportFfmpeg from './Ffmpeg'
import RecorderExportComponent from './Recorder'
import ExportWebm from './Webm'

const ExportSpecific: FC<ExportCommonProps> = props => {
  const { export: exportObj } = props
  switch (exportObj.type) {
    case ExportTypes.MEDIA_RECORDER:
      return <RecorderExportComponent export={exportObj.data} />
    case ExportTypes.FFMPEG:
      return <ExportFfmpeg data={exportObj.data} />
    default:
      return <ExportWebm data={exportObj.data} />
  }
}

export default ExportSpecific
