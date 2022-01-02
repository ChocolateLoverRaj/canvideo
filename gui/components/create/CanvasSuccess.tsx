import { autorun } from 'mobx'
import never from 'never'
import { FC, useContext, useEffect, useRef } from 'react'
import maximizeWithRatio from '../../lib/maximizeWithRatio'
import renderFrame from '../../lib/renderFrame'
import CanvasProps from './CanvasProps'
import styles from './CanvasSuccess.module.css'
import VideoPlayerContext from './ControlsContext'
import { FixedSize } from './VideoRenderer'

const CanvasSuccess: FC<CanvasProps> = ({ availableSpace }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerContext = useContext(VideoPlayerContext)
  const renderer = playerContext.renderer ?? never()
  if (renderer.size.type !== 'fixed') throw new Error('Can only support fixed size currently')
  const scaledSize = maximizeWithRatio(renderer.size, availableSpace)

  useEffect(() => autorun(() => {
    const ctx = canvasRef.current?.getContext('2d') ?? never()
    ctx.clearRect(0, 0, (renderer.size as FixedSize).width, (renderer.size as FixedSize).height)
    renderFrame(ctx, renderer.render(playerContext.playerStore.time))
  }))

  return (
    <canvas
      ref={canvasRef}
      width={renderer.size.width}
      height={renderer.size.height}
      style={scaledSize}
      className={styles.canvas}
    />
  )
}

export default CanvasSuccess
