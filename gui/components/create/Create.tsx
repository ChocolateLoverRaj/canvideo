import { FC, useState } from 'react'
import { Row, Col } from 'antd'
import styles from './Create.module.css'
import Code from './Code'
import defaultCode from './defaultCode.txt'
import CreateContext from './CreateContext'
import VideoPlayer from './VideoPlayer'
import { preferNative as replaceAll } from 'string-replace-all-ponyfill'

const Create: FC = () => {
  const code = useState(() => replaceAll(defaultCode, '\r\n', '\n'))

  return (
    <CreateContext.Provider value={code}>
      <Row className={styles.row}>
        <Col span={12} className={styles.videoPlayer}>
          <VideoPlayer />
        </Col>
        <Col span={12} className={styles.code}>
          <Code />
        </Col>
      </Row>
    </CreateContext.Provider>
  )
}

export default Create
