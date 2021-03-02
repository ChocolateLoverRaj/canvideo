import BaseApp from 'gui/pages/_app'
import { AppProps } from 'next/app'
import Head from 'next/head'
import 'antd/dist/antd.css'
import mainPage from '../lib/mainPage'

const App = (props: AppProps): JSX.Element => (
  <>
    <Head>
      <meta httpEquiv='Content-Security-Policy' content={'script-src \'self\''} />
    </Head>
    <BaseApp
      {...props}
      headerProps={{ api: { mainPage } }}
    />
  </>
)

export default App
