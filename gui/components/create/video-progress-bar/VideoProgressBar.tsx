import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import ControlsContext from '../VideoPlayerContext'
import VideoProgressBarLoaded from './Loaded'
import VideoProgressBarNotLoaded from './NotLoaded'

const VideoProgressBar = observer(() => {
  const { renderer } = useContext(ControlsContext)

  return (
    <>
      {renderer.result !== undefined && renderer.result !== null
        ? <VideoProgressBarLoaded />
        : <VideoProgressBarNotLoaded />}
    </>
  )
})

export default VideoProgressBar
