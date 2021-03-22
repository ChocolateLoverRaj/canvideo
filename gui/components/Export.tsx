import { Progress } from 'antd'
import { FC } from 'react'
import exportStateToText from '../lib/exportStateToText'
import { Export, ExportStates } from '../states/Exports'

interface Props {
  export: Export
}

const ExportComponent: FC<Props> = props => {
  const { export: { state, frames, currentFrame } } = props

  const completedFrames = state === ExportStates.RECORDING_FRAME
    ? currentFrame - 1
    : currentFrame
  const totalFrames = frames.length

  const percent = currentFrame / totalFrames * 100
  const success = completedFrames / totalFrames * 100

  return (
    <div>
      State: {exportStateToText(state)}
      <Progress percent={percent} success={{ percent: success }} />
      Frames recorded: {completedFrames} / {totalFrames}
    </div>
  )
}

export default ExportComponent
