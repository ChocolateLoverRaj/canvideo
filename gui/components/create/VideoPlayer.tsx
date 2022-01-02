import useSize from '@react-hook/size'
import { FC, useContext, useRef, useState } from 'react'
import Canvas from './Canvas'
import Controls from './Controls'
import VideoPlayerContext from './ControlsContext'
import CreateContext from './CreateContext'
import styles from './VideoPlayer.module.css'
import VideoPlayerStore from './VideoPlayerStore'
import { VideoRenderer } from './VideoRenderer'

const VideoPlayer: FC = () => {
  const containerRef = useRef(null)
  const controlsRef = useRef(null)
  const [width, containerHeight] = useSize(containerRef)
  const [, controlsHeight] = useSize(controlsRef)

  const [code] = useContext(CreateContext)

  let renderer: VideoRenderer | undefined
  try {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    renderer = new Function(code)()
  } catch (e) {
    console.error(e)
  }

  const [playerStore] = useState(() => new VideoPlayerStore())

  return (
    <VideoPlayerContext.Provider value={{ playerStore, renderer }}>
      <div ref={containerRef} className={styles.container}>
        <Canvas availableSpace={{ width, height: containerHeight - controlsHeight }} />
        <div ref={controlsRef}>
          <Controls />
        </div>
      </div>
    </VideoPlayerContext.Provider>
  )
}

export default VideoPlayer
