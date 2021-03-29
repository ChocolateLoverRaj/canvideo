import { Progress, Result, Spin } from 'antd'
import { FC } from 'react'
import exportStateToText from '../../lib/exportStateToText'
import { RecorderExportData, RecorderExportStates } from '../../states/Exports'
import { MenuStep, MenuSteps } from '../menu-steps'

interface Props {
  export: RecorderExportData
}

const RecorderExportComponent: FC<Props> = props => {
  const { export: { state, frames, currentFrame, width, height, url } } = props

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
    <MenuSteps
      current={currentStep}
      percent={currentStep === 0 ? success : undefined}
    >
      <MenuStep title='Record frames'>
          State: {exportStateToText(state)}
        <Progress percent={percent} success={{ percent: success }} />
          Frames recorded: {completedFrames} / {totalFrames}
      </MenuStep>
      <MenuStep title='Finish recording'>
        {currentStep === 1
          ? <Spin size='large' tip='Finishing recording' />
          : <Result status='success' title='Finished recording' />}
      </MenuStep>
      <MenuStep title='Download'>
        <video controls width={width} height={height}>
          <source type='video/webm' src={url} />
        </video>
      </MenuStep>
    </MenuSteps>
  )
}

export default RecorderExportComponent
