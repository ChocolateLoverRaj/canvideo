import { FC } from 'react'
import {
  StepBackwardOutlined,
  PauseOutlined,
  StepForwardOutlined
} from '@ant-design/icons'
import LoopIcon from './LoopIcon'
import styles from '../styles/video.module.css'

interface Props {
  className?: string
  width: number
  height: number
  duration: number
  // render: (ctx: CanvasRenderingContext2D, t: number) => void
}

const Video: FC<Props> = props => {
  const { className, width, height } = props

  return (
    <div className={className}>
      <canvas width={width} height={height} />
      <div className={styles.controls}>
        <StepBackwardOutlined />
        <PauseOutlined />
        <StepForwardOutlined />
        <LoopIcon />
      </div>

    </div>
  )
}

export default Video
