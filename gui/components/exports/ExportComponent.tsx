import { FC } from 'react'
import ExportObj from '../../mobx/ExportObj'
import ExportCommon from './Common'
import ExportSpecific from './Specific'

const ExportComponent: FC<ExportObj> = props => (
  <>
    <ExportCommon {...props} />
    <ExportSpecific {...props} />
  </>
)

export default ExportComponent
