import { Progress, Result, Spin } from 'antd'
import { FC } from 'react'
import { FfmpegExportData, FfmpegExportStates } from '../../states/Exports'
import { MenuStep, MenuSteps } from '../menu-steps'

interface Props {
  data: FfmpegExportData
}

const ExportFfmpeg: FC<Props> = props => {
  const {
    data: {
      state,
      frames,
      completedFrames,
      generateProgress,
      width,
      height,
      url
    }
  } = props

  let currentStep: number
  switch (state) {
    case FfmpegExportStates.LOADING_FFMPEG:
      currentStep = 0
      break
    case FfmpegExportStates.CREATING_PNG:
      currentStep = 1
      break
    case FfmpegExportStates.GENERATING_VIDEO:
      currentStep = 2
      break
    default:
      currentStep = 3
  }

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
      currentPercent = generateProgress * 100
  }

  return (
    <MenuSteps
      current={currentStep}
      percent={currentPercent}
    >
      <MenuStep title='Load FFmpeg'>
        {currentStep === 0
          ? <Spin size='large' tip='Loading FFmpeg' />
          : <Result status='success' title='Loaded FFmpeg' />}
      </MenuStep>
      <MenuStep title='Create Images'>
        <Progress percent={percent} success={{ percent: success }} />
          Frames rendered: {completedFrames} / {frames.length}
      </MenuStep>
      <MenuStep title='Generate Video'>
        <Progress percent={generateProgress * 100} />
      </MenuStep>
      <MenuStep title='Download Video'>
        <video width={width} height={height} controls>
          <source type='video/mp4' src={url} />
        </video>
      </MenuStep>
    </MenuSteps>
  )
}

export default ExportFfmpeg
