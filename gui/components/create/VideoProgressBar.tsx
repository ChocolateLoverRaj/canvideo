import { Progress } from 'antd'
import { observer } from 'mobx-react-lite'
import { useContext, useRef } from 'react'
import ControlsContext from './ControlsContext'
import styles from './VideoProgressBar.module.css'

const VideoProgressBar = observer(() => {
  const { renderer, playerStore } = useContext(ControlsContext)
  const ref = useRef(null)

  console.log(ref)

  return (
    <Progress
      strokeLinecap='butt'
      percent={renderer?.duration !== undefined ? playerStore.time / renderer.duration * 100 : 100}
      showInfo={false}
      status={renderer?.duration === undefined
        ? playerStore.paused ? 'normal' : 'active'
        : playerStore.time >= renderer.duration
          ? 'success'
          : playerStore.paused ? 'normal' : 'active'}
      className={styles.progressBar}
    />
  )
})

export default VideoProgressBar
