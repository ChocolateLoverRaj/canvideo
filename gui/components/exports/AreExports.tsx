import { observer } from 'mobx-react-lite'
import exportsStore from '../../mobx/exportsStore'
import ExportComponent from './ExportComponent'

const AreExports = observer(() => (
  <>
    {exportsStore.exports.map((e, index) => <ExportComponent {...e} key={index} />)}
  </>))

export default AreExports
