import HeadTitle from '../components/HeadTitle'
import mainTitle from '../lib/mainTitle'
import { observer } from 'mobx-react-lite'
import DefaultMethodPicker from '../components/default-method-picker'

const App = observer(() => (
  <>
    <HeadTitle paths={[mainTitle, 'Settings']} />
    What method do you want to use to generate your videos by default?
    <br />
    <DefaultMethodPicker />
  </>
))

export default App
