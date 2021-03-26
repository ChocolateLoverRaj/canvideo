import { FC } from 'react'
import { ExportTypes, Export } from '../../states/Exports'
import RecorderExportComponent from './Recorder'

interface Props {
  export: Export
}

const ExportComponent: FC<Props> = props => {
  const { export: exportObj } = props
  switch (exportObj.type) {
    case ExportTypes.MEDIA_RECORDER:
      return <RecorderExportComponent export={exportObj.data} />
    case ExportTypes.FFMPEG:
      throw new Error('Ffmpeg not supported')
  }
}

export default ExportComponent
