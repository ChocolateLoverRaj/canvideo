import { FC } from 'react'
import ExportObj from '../../mobx/ExportObj'
import ExportTypes from '../../types/ExportTypes'
import ExportFfmpeg from './Ffmpeg'
import ExportWebm from './Webm'

const ExportSpecific: FC<ExportObj> = props => {
  const { e, type } = props

  return type === ExportTypes.WEBM_WRITER
    ? <ExportWebm {...{ e } as any} />
    : <ExportFfmpeg {...{ e } as any} />
}

export default ExportSpecific
