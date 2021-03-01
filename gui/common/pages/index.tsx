import Head from 'next/head'
import Link from 'next/link'

const App = (): JSX.Element => (
  <>
    <Head>
      <title>Canvideo</title>
    </Head>
    <h1>Canvideo GUI</h1>
    <Link href='/create'>Create a video</Link>
  </>
)

export default App
