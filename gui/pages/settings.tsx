import { FC, useCallback } from 'react'
import { Radio, RadioChangeEvent } from 'antd'
import { ExportTypes } from '../states/Exports'
import HeadTitle from '../components/HeadTitle'
import mainTitle from '../lib/mainTitle'
import exportTypes from '../lib/exportTypes'
import exportTypeToText from '../lib/exportTypeToText'
import { useLocalStorage } from '@rehooks/local-storage'

const App: FC = () => {
  // TODO: useLocalStorage
  const [exportType, setExportType] = useLocalStorage('exportType', ExportTypes.WEBM_WRITER)

  const handleChange = useCallback(({ target: { value } }: RadioChangeEvent) => {
    setExportType(value)
  }, [setExportType])

  return (
    <>
      <HeadTitle paths={[mainTitle, 'Settings']} />
      What method do you want to use to generate your videos by default? Coming soon.
      <br />
      <Radio.Group value={exportType} onChange={handleChange}>
        {exportTypes.map(exportType => (
          <Radio key={exportType} value={exportType}>Use {exportTypeToText(exportType)}</Radio>
        ))}
      </Radio.Group>
    </>
  )
}

export default App
