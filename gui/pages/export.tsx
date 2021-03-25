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
      {exports.size !== 0
        ? [...exports]
          .map(recorderDataMapFn)
          .map((currentExport, index) => (
            <Fragment key={index}>
              <ExportComponent export={currentExport} />
              {index !== exports.size - 1 && <Divider />}
            </Fragment>
          ))
        : <Empty description={<>No exports. Click <Link href='/create'>here</Link> to export a video.</>} />}
    </>
  )
}

export default App
