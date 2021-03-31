import { FC, useState } from 'react'
import HeadTitle from '../components/HeadTitle'
import Video from '../components/Video'
import mainTitle from '../lib/mainTitle'
import CreateSample from '../components/CreateSample'
import JsonInput from '@chocolateloverraj/react-json-input'
import styles from '../styles/create.module.css'
import projectSchema from '../lib/projectSchema'

const App: FC = () => {
  const [video, setVideo] = useState<any>({
    width: 400,
    height: 400,
    duration: 10,
    frames: []
  })
  const { width, height, duration } = video

  return (
    <>
      <HeadTitle paths={[mainTitle, 'Create']} />
      <CreateSample />
      <div className={styles.editor}>
        <Video
          width={width}
          height={height}
          duration={duration}
        />
        <div className={styles.json}>
          <JsonInput schema={projectSchema} value={video} onChange={setVideo} />
        </div>
      </div>
    </>
  )
}

export default App
