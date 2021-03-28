import { FC } from 'react'
import ExportCommon, { ExportCommonProps } from './Common'
import ExportSpecific from './Specific'

const ExportComponent: FC<ExportCommonProps> = props => (
  <>
    <ExportCommon {...props} />
    <ExportSpecific {...props} />
  </>
)

export default ExportComponent
