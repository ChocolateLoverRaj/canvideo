import BaseApp from 'gui/pages/_app'
import { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import mainPage from '../lib/mainPage'

const App = (props: AppProps): JSX.Element => (
  <>
    <BaseApp
      {...props}
      headerProps={{ api: { mainPage } }}
    />
  </>
)

export default App
