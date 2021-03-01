import BaseApp from 'gui/pages/_app'
import { AppProps } from 'next/app'
import Head from 'next/head'

const App = (props: AppProps): JSX.Element => (
  <>
    <Head>
      <meta httpEquiv='Content-Security-Policy' content={'script-src \'self\''} />
    </Head>
    <BaseApp {...props} />
  </>
)

export default App
