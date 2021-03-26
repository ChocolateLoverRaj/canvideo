import { Divider, Empty } from 'antd'
import Link from 'next/link'
import { FC, Fragment, useContext } from 'react'
import ExportComponent from '../components/export'
import GlobalContext from '../contexts/Global'
import HeadTitle from '../components/HeadTitle'
import mainTitle from '../lib/mainTitle'

const App: FC = () => {
  const { exports: [exports] } = useContext(GlobalContext)

  return (
    <>
      <HeadTitle paths={[mainTitle, 'Export']} />
      <h1>Exports</h1>
      <p>Below is the list of videos that are exported.</p>
      {exports.size !== 0
        ? [...exports]
          .map((currentExport, index) => (
            <Fragment key={index}>
              <Divider />
              <ExportComponent export={currentExport} />
            </Fragment>
          ))
        : <Empty description={<>No exports. Click <Link href='/create'>here</Link> to export a video.</>} />}
    </>
  )
}

export default App
