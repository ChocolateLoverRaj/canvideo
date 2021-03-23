import { Collapse, Progress } from 'antd'
import { FC } from 'react'
import exportStateToText from '../lib/exportStateToText'
import { Export, ExportStates } from '../states/Exports'

interface Props {
  export: Export
}

const ExportComponent: FC<Props> = props => {
  const { export: { state, frames, currentFrame, width, height, url } } = props

  const completedFrames = state === ExportStates.RECORDING_FRAME
    ? currentFrame - 1
    : currentFrame
  const totalFrames = frames.length

  const percent = currentFrame / totalFrames * 100
  const success = completedFrames / totalFrames * 100

  return (
    <>
      State: {exportStateToText(state)}
      <Progress percent={percent} success={{ percent: success }} />
      Frames recorded: {completedFrames} / {totalFrames}
      <Collapse ghost>
        <Collapse.Panel
          key='video'
          collapsible={state === ExportStates.COMPLETE ? 'header' : 'disabled'}
          header='View video'
        >
          <video controls width={width} height={height}>
            <source type='video/webm' src={url} />
          </video>
        </Collapse.Panel>
      </Collapse>
    </>
  )
}

export default ExportComponent
