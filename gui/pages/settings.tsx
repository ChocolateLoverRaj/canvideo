import { FC, useCallback, useState } from 'react'
import { Radio, RadioChangeEvent } from 'antd'

enum ExportTypes {
  MEDIA_RECORDER,
  FFMPEG
}

const App: FC = () => {
  // TODO: useLocalStorage
  const [exportType, setExportType] = useState(ExportTypes.FFMPEG)

  const handleChange = useCallback(({ target: { value } }: RadioChangeEvent) => {
    setExportType(value)
  }, [setExportType])

  return (
    <>
      How do you want to generate your videos?
      <br />
      <Radio.Group value={exportType} onChange={handleChange}>
        <Radio value={ExportTypes.FFMPEG}>Use in browser FFmpeg</Radio>
        <Radio value={ExportTypes.MEDIA_RECORDER}>Use MediaRecorder</Radio>
      </Radio.Group>
    </>
  )
}

export default App
