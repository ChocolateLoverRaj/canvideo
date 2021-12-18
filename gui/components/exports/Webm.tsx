import { Progress, Result, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import WebmWriterExport from '../../lib/createExport/WebmWriterExport'
import { MenuStep, MenuSteps } from '../menu-steps'

interface Props {
  e: WebmWriterExport
}

const ExportWebm = observer<Props>(props => {
  const { e } = props

  const percent = e.renderedFrames / e.totalFrames * 100

  return (
    <MenuSteps current={e.promise.wasSuccessful ? 2 : e.renderedFrames === e.totalFrames ? 1 : 0}>
      <MenuStep title='Render Frames'>
        <Progress {...{ percent }} success={{ percent }} />
        Frames rendered: {e.renderedFrames} / {e.totalFrames}
      </MenuStep>
      <MenuStep title='Generate Blob'>
        {e.promise.isExecuting
          ? <Spin size='large' tip='Generating blob' />
          : <Result status='success' title='Generated Blob' />}
      </MenuStep>
      <MenuStep title='Download'>
        <video width={e.width} height={e.height} controls>
          <source type='video/webm' src={e.promise.result} />
        </video>
      </MenuStep>
    </MenuSteps>
  )
})

export default ExportWebm
