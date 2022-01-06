import { FC } from 'react'
import { Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const CanvasLoading: FC = () => {
  return <Result icon={<LoadingOutlined />} title='Loading Code' />
}

export default CanvasLoading
