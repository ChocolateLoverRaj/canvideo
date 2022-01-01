import { FC, useRef, useState } from 'react'
import { Row, Col } from 'antd'
import styles from '../../styles/Create.module.css'
import Code from './Code'
import VideoPreview from './VideoPreview'
import defaultCode from './defaultCode.txt'
import useSize from '@react-hook/size'

const Create: FC = () => {
  const code = useState(defaultCode.toString())
  const previewRef = useRef(null)
  const [width, height] = useSize(previewRef)

  return (
    <Row className={styles.row}>
      <Col span={12} ref={previewRef}>
        <VideoPreview {...{ code }} availableSpace={{ width, height }} />
      </Col>
      <Col span={12} style={{ overflow: 'auto', height: '100%' }}>
        <Code {...{ code }} />
      </Col>
    </Row>
  )
}

export default Create
