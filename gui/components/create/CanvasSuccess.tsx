import { autorun } from 'mobx'
import never from 'never'
import { FC, useContext, useEffect, useRef } from 'react'
import maximizeWithRatio from '../../lib/maximizeWithRatio'
import renderFrame from '../../lib/renderFrame'
import CanvasProps from './CanvasProps'
import styles from './CanvasSuccess.module.css'
import VideoPlayerContext from './VideoPlayerContext'
import { FixedSize } from './VideoRenderer'

const CanvasSuccess: FC<CanvasProps> = ({ availableSpace }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerContext = useContext(VideoPlayerContext)
  const renderer = playerContext.renderer ?? never()
  if (renderer.result.size.type !== 'fixed') throw new Error('Can only support fixed size currently')
  const scaledSize = maximizeWithRatio(renderer.result.size, availableSpace)

  useEffect(() => autorun(async () => {
    const ctx = canvasRef.current?.getContext('2d') ?? never()
    // FIXME: This could be very laggy and result in an unsmooth, laggy video playing not in sync with progress bar
    const operations = await renderer.result.render(playerContext.playerStore.time)
    ctx.clearRect(0, 0, (renderer.result.size as FixedSize).width, (renderer.result.size as FixedSize).height)
    renderFrame(ctx, operations)
  }))

  return (
    <canvas
      ref={canvasRef}
      width={renderer.result.size.width}
      height={renderer.result.size.height}
      style={scaledSize}
      className={styles.canvas}
    />
  )
}

export default CanvasSuccess
