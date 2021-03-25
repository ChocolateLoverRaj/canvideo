import { FC, useCallback, useState } from 'react'
import { Radio, RadioChangeEvent } from 'antd'
import { ExportTypes } from '../states/Exports'

const App: FC = () => {
  // TODO: useLocalStorage
  const [exportType, setExportType] = useState(ExportTypes.MEDIA_RECORDER)

  const handleChange = useCallback(({ target: { value } }: RadioChangeEvent) => {
    setExportType(value)
  }, [setExportType])

  return (
    <>
      What method do you want to use to generate your videos by default? Coming soon.
      <br />
      <Radio.Group value={exportType} onChange={handleChange} disabled>
        <Radio value={ExportTypes.FFMPEG}>Use in browser FFmpeg</Radio>
        <Radio value={ExportTypes.MEDIA_RECORDER}>Use MediaRecorder</Radio>
      </Radio.Group>
    </>
  )
}

export default App
