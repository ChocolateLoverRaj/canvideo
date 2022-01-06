import useSize from '@react-hook/size'
import { FC, useContext, useRef, useState } from 'react'
import Canvas from './Canvas'
import Controls from './Controls'
import VideoPlayerContext from './VideoPlayerContext'
import CreateContext from './CreateContext'
import styles from './VideoPlayer.module.css'
import VideoPlayerStore from './VideoPlayerStore'
import { useMemoOne } from 'use-memo-one'
import { ObservablePromise } from 'mobx-observable-promise'
import importFromWorker from '../../lib/import-from-worker'

const VideoPlayer: FC = () => {
  const containerRef = useRef(null)
  const controlsRef = useRef(null)
  const [width, containerHeight] = useSize(containerRef)
  const [, controlsHeight] = useSize(controlsRef)

  const [code] = useContext(CreateContext)

  const renderer = useMemoOne(() => {
    const observablePromise = new ObservablePromise(async () => await importFromWorker(code))
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    observablePromise.execute().catch()

    ;(globalThis.code ?? (globalThis.code = [])).push(code)
    return observablePromise
  }, [code])

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
