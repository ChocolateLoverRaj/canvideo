import { Divider, Empty } from 'antd'
import recorderDataMapFn from '../lib/recorderDataMapFn'
import Link from 'next/link'
import { FC, Fragment, useContext } from 'react'
import ExportComponent from '../components/Export'
import GlobalContext from '../contexts/Global'

const App: FC = () => {
  const { exports: [exports] } = useContext(GlobalContext)

  return (
    <>
      <h1>Exports</h1>
      <p>Below is the list of videos that are exported.</p>
      {exports.size !== 0
        ? [...exports]
          .map(recorderDataMapFn)
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
