import { FC } from 'react'
import { Progress } from 'antd'
import styles from './NotLoaded.module.css'

const VideoProgressBarNotLoaded: FC = () => {
  return (
    <Progress className={styles.progressBar} showInfo={false} />
  )
}

export default VideoProgressBarNotLoaded
