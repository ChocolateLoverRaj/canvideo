import useSize from '@react-hook/size'
import { FC, useRef } from 'react'
import Canvas from './Canvas'
import styles from './VideoPlayer.module.css'

const VideoPlayer: FC = () => {
  const containerRef = useRef(null)
  const controlsRef = useRef(null)
  const [width, containerHeight] = useSize(containerRef)
  const [, controlsHeight] = useSize(controlsRef)

  return (
    <div ref={containerRef} className={styles.container}>
      <Canvas availableSpace={{ width, height: containerHeight - controlsHeight }} />
      <div ref={controlsRef}>
        Controls
      </div>
    </div>
  )
}

export default VideoPlayer
