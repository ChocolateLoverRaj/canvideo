import { FC } from 'react'
import PreviewSuccess from './PreviewSuccess'
import VideoPreviewProps from './VideoPreviewProps'

const VideoPreview: FC<VideoPreviewProps> = props => {
  const { code: [code] } = props

  let video: any
  try {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    video = new Function(code)()
  } catch (e) {
    console.error(e)
  }

  return (
    <>
      {video !== undefined
        ? <PreviewSuccess {...props} video={video} />
        : 'Error'}
    </>
  )
}

export default VideoPreview
