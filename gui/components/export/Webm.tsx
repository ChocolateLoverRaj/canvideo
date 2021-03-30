import { Progress, Result, Spin } from 'antd'
import { FC } from 'react'
import { WebmExportData, WebmExportStates } from '../../states/Exports'
import { MenuStep, MenuSteps } from '../menu-steps'

interface Props {
  data: WebmExportData
}

type CurrentSteps = {
  [K in WebmExportStates]: number
}

const currentSteps: CurrentSteps = {
  [WebmExportStates.RENDERING_FRAMES]: 0,
  [WebmExportStates.GENERATING_BLOB]: 1,
  [WebmExportStates.COMPLETE]: 2
}

const ExportWebm: FC<Props> = props => {
  const { data: { state, frames, completedFrames, width, height, url } } = props

  const success = completedFrames / frames.length * 100
  const percent = state === WebmExportStates.RENDERING_FRAMES
    ? (completedFrames + 1) / frames.length * 100
    : success

  return (
    <MenuSteps current={currentSteps[state]}>
      <MenuStep title='Render Frames'>
        <Progress percent={percent} success={{ percent: success }} />
        Frames rendered: {completedFrames} / {frames.length}
      </MenuStep>
      <MenuStep title='Generate Blob'>
        {state === WebmExportStates.GENERATING_BLOB
          ? <Spin size='large' tip='Generating blob' />
          : <Result status='success' title='Generated Blob' />}
      </MenuStep>
      <MenuStep title='Download'>
        <video width={width} height={height} controls>
          <source type='video/webm' src={url} />
        </video>
      </MenuStep>
    </MenuSteps>
  )
}

export default ExportWebm
