import { Progress, Result, Spin, Steps } from 'antd'
import never from 'never'
import { FC, useState } from 'react'
import { FfmpegExportData, FfmpegExportStates } from '../../states/Exports'
import MainColor from '../MainColor'

interface Props {
  data: FfmpegExportData
}

const ExportFfmpeg: FC<Props> = props => {
  const { data: { state, frames, completedFrames, progress } } = props

  const [shownStep, setShownStep] = useState(0)

  const currentStep = state === FfmpegExportStates.LOADING_FFMPEG
    ? 0
    : state === FfmpegExportStates.CREATING_PNG
      ? 1
      : 2

  const success = completedFrames / frames.length * 100
  const percent = state === FfmpegExportStates.CREATING_PNG
    ? (completedFrames + 1) / frames.length * 100
    : success

  let currentPercent: number | undefined
  switch (state) {
    case FfmpegExportStates.CREATING_PNG:
      currentPercent = percent
      break
    case FfmpegExportStates.GENERATING_VIDEO:
      currentPercent = (progress ?? never('No progress')) * 100
  }

  return (
    <>
      <Steps
        current={shownStep}
        onChange={setShownStep}
        type='navigation'
        percent={currentPercent}
      >
        <Steps.Step
          title={<MainColor isMainColor={shownStep === 0}>Load FFmpeg</MainColor>}
          status={currentStep === 0 ? 'process' : 'finish'}
        />
        <Steps.Step
          title={<MainColor isMainColor={shownStep === 1}>Create Images</MainColor>}
          status={currentStep < 1 ? 'wait' : currentStep === 1 ? 'process' : 'finish'}
          disabled={currentStep < 1}
        />
        <Steps.Step
          title={<MainColor isMainColor={shownStep === 2}>Generate Video</MainColor>}
          status={currentStep < 2 ? 'wait' : currentStep === 2 ? 'process' : 'finish'}
          disabled={currentStep < 2}
        />
        <Steps.Step
          title={<MainColor isMainColor={shownStep === 3}>Download Video</MainColor>}
          status={currentStep < 3 ? 'wait' : 'process'}
          disabled={currentStep < 3}
        />
      </Steps>
      {shownStep === 0 && (currentStep === 0
        ? <Spin size='large' tip='Loading FFmpeg' />
        : <Result status='success' title='Loaded FFmpeg' />
      )}
      {shownStep === 1 && (
        <>
          <Progress percent={percent} success={{ percent: success }} />
          Frames rendered: {completedFrames} / {frames.length}
        </>
      )}
      {shownStep === 2 && <Progress percent={(progress ?? never('No progress')) * 100} />}
    </>
  )
}

export default ExportFfmpeg
