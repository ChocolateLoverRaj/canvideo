import { Descriptions, Progress, Steps } from 'antd'
import { FC, useState } from 'react'
import exportStateToText from '../lib/exportStateToText'
import exportTypeToText from '../lib/exportTypeToText'
import { ExportTypes, RecorderExportData, RecorderExportStates } from '../states/Exports'
import MainColor from './MainColor'

interface Props {
  export: RecorderExportData
}

const ExportComponent: FC<Props> = props => {
  const { export: { state, frames, currentFrame, width, height, url } } = props

  const [shownStep, setShownStep] = useState(0)

  const completedFrames = state === RecorderExportStates.RECORDING_FRAME
    ? currentFrame - 1
    : currentFrame
  const totalFrames = frames.length

  const percent = currentFrame / totalFrames * 100
  const success = completedFrames / totalFrames * 100

  const currentStep = state === RecorderExportStates.WAITING_FOR_ANIMATION_FRAME || state === RecorderExportStates.RECORDING_FRAME
    ? 0
    : state === RecorderExportStates.WAITING_FOR_DATA
      ? 1
      : 2

  return (
    <>
      <Descriptions>
        <Descriptions.Item label='Type'>{exportTypeToText(ExportTypes.MEDIA_RECORDER)}</Descriptions.Item>
      </Descriptions>
      <Steps
        type='default'
        direction='vertical'
        current={shownStep}
        onChange={setShownStep}
        percent={currentStep === 0 ? success : undefined}
      >
        <Steps.Step
          title={<MainColor isMainColor={shownStep === 0}>Record frames</MainColor>}
          status={currentStep === 0 ? 'process' : 'finish'}
        />
        <Steps.Step
          title={<MainColor isMainColor={shownStep === 1}>Finish recording</MainColor>}
          status={currentStep < 1 ? 'wait' : currentStep === 1 ? 'process' : 'finish'}
          disabled={currentStep < 1}
        />
        <Steps.Step
          title={<MainColor isMainColor={shownStep === 2}>Download</MainColor>}
          status={currentStep < 2 ? 'wait' : 'process'}
          disabled={currentStep < 2}
        />
      </Steps>
      {shownStep === 0 && (
        <>
          State: {exportStateToText(state)}
          <Progress percent={percent} success={{ percent: success }} />
          Frames recorded: {completedFrames} / {totalFrames}
        </>
      )}
      {shownStep === 2 && (
        <video controls width={width} height={height}>
          <source type='video/webm' src={url} />
        </video>
      )}
    </>
  )
}

export default ExportComponent
