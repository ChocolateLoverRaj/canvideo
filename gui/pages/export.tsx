import { FC } from 'react'
import Exports from '../components/exports'
import HeadTitle from '../components/HeadTitle'
import mainTitle from '../lib/mainTitle'

const App: FC = () => {
  return (
    <>
      <HeadTitle paths={[mainTitle, 'Export']} />
      <h1>Exports</h1>
      <p>Below is the list of videos that are exported.</p>
      <Exports />
    </>
  )
}

export default App
