import { FC } from 'react'
import HeadTitle from '../components/HeadTitle'
import mainTitle from '../lib/mainTitle'
import Create from '../components/create'

const App: FC = () => {
  return (
    <>
      <HeadTitle paths={[mainTitle, 'Create']} />
      <Create />
    </>
  )
}

export default App
