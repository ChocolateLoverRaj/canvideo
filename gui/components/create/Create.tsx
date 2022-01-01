import { FC, useState } from 'react'
import { Row, Col } from 'antd'
import styles from './Create.module.css'
import Code from './Code'
import defaultCode from './defaultCode.txt'
import CreateContext from './CreateContext'
import VideoPlayer from './VideoPlayer'

const Create: FC = () => {
  const code = useState(defaultCode.toString())

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
