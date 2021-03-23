import { Divider, Empty } from 'antd'
import Link from 'next/link'
import { FC, Fragment, useContext } from 'react'
import ExportComponent from '../components/Export'
import ExportsContext from '../contexts/Exports'

const App: FC = () => {
  const [exports] = useContext(ExportsContext)

  return (
    <>
      {exports.size !== 0
        ? [...exports]
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
