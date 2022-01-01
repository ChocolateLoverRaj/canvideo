import { FC } from 'react'
import maximizeWithRatio from '../../lib/maximizeWithRatio'
import VideoPreviewProps from './VideoPreviewProps'

export interface PreviewSuccessProps extends VideoPreviewProps {
  video: any
}

const PreviewSuccess: FC<PreviewSuccessProps> = ({ code: [code], availableSpace, video }) => {
  const scaledSize = maximizeWithRatio(video, availableSpace)

  return (
    <>
      {video !== undefined
        ? <canvas width={video.width} height={video.height} style={scaledSize} />
        : 'Error'}
    </>
  )
}

export default PreviewSuccess
