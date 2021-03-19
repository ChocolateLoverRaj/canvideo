import { FC } from 'react'
import Head from 'next/head'
import Export, { ExportProps } from '../components/Export'

const App: FC<ExportProps> = props => (
  <>
    <Head>
      <title>Export {'\u2022'} Canvideo</title>
    </Head>
    <Export {...props }/>
  </>
)

export default App
