import { FC, useState } from 'react'
import HeadTitle from '../components/HeadTitle'
import Video from '../components/Video'
import mainTitle from '../lib/mainTitle'
import operationsSchema from 'canvideo/dist/operations.schema.json'
import CreateSample from '../components/CreateSample'
import JsonInput from '@chocolateloverraj/react-json-input'
import { JSONSchema7 } from 'json-schema'
import styles from '../styles/create.module.css'

const schema: JSONSChema7 = {
  type: 'array',
  items: operationsSchema
}

const App: FC = () => {
  const [video, setVideo] = useState<any>([])

  return (
    <>
      <HeadTitle paths={[mainTitle, 'Create']} />
      <CreateSample />
      <div className={styles.editor}>
        <Video className={styles.video} />
        <div className={styles.json}>
          <JsonInput schema={schema} value={video} onChange={setVideo} />
        </div>
      </div>
    </>
  )
}

export default App
