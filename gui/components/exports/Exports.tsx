import { observer } from 'mobx-react-lite'
import exportsStore from '../../mobx/exportsStore'
import AreExports from './AreExports'
import NoExports from './NoExports'

const Exports = observer(() => (
  <>
    {exportsStore.exports.length > 0
      ? <AreExports />
      : <NoExports />}
  </>))

export default Exports
