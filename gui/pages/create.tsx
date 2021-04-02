import { FC, useCallback, useState } from 'react'
import HeadTitle from '../components/HeadTitle'
import Video, { RenderFn } from '../components/Video'
import mainTitle from '../lib/mainTitle'
import CreateSample from '../components/CreateSample'
import JsonInput from '@chocolateloverraj/react-json-input'
import styles from '../styles/create.module.css'
import projectSchema from '../lib/projectSchema'
import renderFrame from 'canvideo/dist/render-frame'

const App: FC = () => {
  const [video, setVideo] = useState<any>({
    width: 400,
    height: 400,
    duration: 10,
    frames: [
      ['setFillStyle', ['white']],
      ['fillRect', [0, 0, 400, 400]],
      ['setFillStyle', ['blue']],
      ['fillRect', [200, 200, 200, 200]]
    ]
  })
  const { width, height, duration } = video

  const render = useCallback<RenderFn>(ctx => {
    console.log(ctx, video.frames)
    renderFrame(ctx, video.frames)
  }, [video.frames])

  return (
    <>
      <HeadTitle paths={[mainTitle, 'Create']} />
      <CreateSample />
      <div className={styles.editor}>
        <Video
          width={width}
          height={height}
          duration={duration}
          render={render}
        />
        <div className={styles.json}>
          <JsonInput schema={projectSchema} value={video} onChange={setVideo} />
        </div>
      </div>
    </>
  )
}

export default App
