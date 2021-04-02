import { FC, useEffect, useRef, useState } from 'react'
import {
  StepBackwardOutlined,
  PauseOutlined,
  StepForwardOutlined
} from '@ant-design/icons'
import LoopIcon from './LoopIcon'
import styles from '../styles/video.module.css'
import ClickableProgress from './ClickableProgress'
import never from 'never'

export type RenderFn = (ctx: CanvasRenderingContext2D, t: number) => void

interface Props {
  className?: string
  width: number
  height: number
  duration: number
  render: RenderFn
}

const Video: FC<Props> = props => {
  const { className, width, height, render } = props

  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    render(ref.current?.getContext('2d') ?? never('No ref or 2d'), 0)
  }, [render, ref])

  const [progress, setProgress] = useState(0.5)

  return (
    <div className={className}>
      <canvas width={width} height={height} ref={ref} />
      <ClickableProgress progress={progress} onChange={setProgress} />
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
