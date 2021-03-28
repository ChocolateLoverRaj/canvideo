import { FC } from 'react'
import { ExportTypes } from '../../states/Exports'
import { ExportCommonProps } from './Common'
import RecorderExportComponent from './Recorder'

const ExportSpecific: FC<ExportCommonProps> = props => {
  const { export: exportObj } = props
  switch (exportObj.type) {
    case ExportTypes.MEDIA_RECORDER:
      return <RecorderExportComponent export={exportObj.data} />
    case ExportTypes.FFMPEG:
      throw new Error('Ffmpeg not supported')
  }
}

export default ExportSpecific
