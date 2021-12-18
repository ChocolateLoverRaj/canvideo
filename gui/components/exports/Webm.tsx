import { Progress, Result, Spin } from 'antd'
import { FC } from 'react'
import WebmWriterExport from '../../lib/createExport/WebmWriterExport'
import { MenuStep, MenuSteps } from '../menu-steps'

interface Props {
  e: WebmWriterExport
}

const ExportWebm: FC<Props> = props => {
  const { e } = props

  console.log(e)

  return (
    <MenuSteps current={e.generateBlob.wasSuccessful ? 2 : 1}>
      <MenuStep title='Render Frames'>
        <Progress percent={100} success={{ percent: 100 }} />
        Frames rendered: {frames.length} / {frames.length}
      </MenuStep>
      <MenuStep title='Generate Blob'>
        {e.generateBlob.isExecuting
          ? <Spin size='large' tip='Generating blob' />
          : <Result status='success' title='Generated Blob' />}
      </MenuStep>
      <MenuStep title='Download'>
        <video width={e.width} height={e.height} controls>
          <source type='video/webm' src={e.generateBlob.result} />
        </video>
      </MenuStep>
    </MenuSteps>
  )
}

export default ExportWebm
