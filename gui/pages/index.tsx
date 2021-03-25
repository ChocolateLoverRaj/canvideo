import Link from 'next/link'
import HeadTitle from '../components/HeadTitle'
import mainTitle from '../lib/mainTitle'

const App = (): JSX.Element => (
  <>
    <HeadTitle paths={[mainTitle]} />
    <h1>Canvideo GUI</h1>
    <Link href='/create'>Create a video</Link>
  </>
)

export default App
