import { Progress, Result, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import FfmpegExport from '../../lib/createExport/FfmpegExport'
import { MenuStep, MenuSteps } from '../menu-steps'

interface Props {
  e: FfmpegExport
}

const ExportFfmpeg = observer<Props>(props => {
  const { e } = props

  let currentStep: number
  if (!e.loaded) {
    currentStep = 0
  } else if (e.renderedFrames < e.totalFrames) {
    currentStep = 1
  } else if (e.promise.isExecuting) {
    currentStep = 2
  } else {
    currentStep = 3
  }

  const success = e.renderedFrames / e.totalFrames * 100

  const percent = (e.renderedFrames < e.totalFrames
    ? e.renderedFrames / e.totalFrames
    : e.ffmpegProgress) * 100

  return (
    <MenuSteps
      current={currentStep}
      percent={percent}
    >
      <MenuStep title='Load FFmpeg'>
        {currentStep === 0
          ? <Spin size='large' tip='Loading FFmpeg' />
          : <Result status='success' title='Loaded FFmpeg' />}
      </MenuStep>
      <MenuStep title='Create Images'>
        <Progress percent={percent} success={{ percent: success }} />
        Frames rendered: {e.renderedFrames} / {e.totalFrames}
      </MenuStep>
      <MenuStep title='Generate Video'>
        <Progress percent={percent} />
      </MenuStep>
      <MenuStep title='Download Video'>
        <video width={e.width} height={e.height} controls>
          <source type='video/mp4' src={URL.createObjectURL(new Blob([e.promise.result], { type: 'video/mp4' }))} />
        </video>
      </MenuStep>
    </MenuSteps>
  )
})

export default ExportFfmpeg
