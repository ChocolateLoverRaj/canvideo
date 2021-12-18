import { FC, useCallback, useState } from 'react'
import { Radio, RadioChangeEvent } from 'antd'
import ExportTypes from '../types/ExportTypes'
import HeadTitle from '../components/HeadTitle'
import mainTitle from '../lib/mainTitle'
import exportTypes from '../lib/exportTypes'
import exportTypeToText from '../lib/exportTypeToText'

const App: FC = () => {
  // TODO: useLocalStorage
  const [exportType, setExportType] = useState(ExportTypes.WEBM_WRITER)

  const handleChange = useCallback(({ target: { value } }: RadioChangeEvent) => {
    setExportType(value)
  }, [setExportType])

  return (
    <>
      <HeadTitle paths={[mainTitle, 'Settings']} />
      What method do you want to use to generate your videos by default? Coming soon.
      <br />
      <Radio.Group value={exportType} onChange={handleChange} disabled>
        {exportTypes.map(exportType => (
          <Radio key={exportType} value={exportType}>Use {exportTypeToText(exportType)}</Radio>
        ))}
      </Radio.Group>
    </>
  )
}

export default App
