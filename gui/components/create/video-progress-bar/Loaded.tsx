import { Progress } from 'antd'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import ControlsContext from '../VideoPlayerContext'
import styles from './Loaded.module.css'

const VideoProgressBarLoaded = observer(() => {
  const { renderer, playerStore } = useContext(ControlsContext)

  return (
    <Progress
      strokeLinecap='butt'
      percent={renderer.result.duration !== undefined ? playerStore.time / renderer.result.duration * 100 : 100}
      showInfo={false}
      status={renderer.result.duration === undefined
        ? playerStore.paused ? 'normal' : 'active'
        : playerStore.time >= renderer.result.duration
          ? 'success'
          : playerStore.paused ? 'normal' : 'active'}
      className={styles.progressBar}
    />
  )
})

export default VideoProgressBarLoaded
