import { FC } from 'react'
import exportTypeToText from '../../lib/exportTypeToText'
import { Descriptions } from 'antd'
import ExportObj from '../../mobx/ExportObj'

const ExportCommon: FC<ExportObj> = props => {
  const { type } = props

  return (
    <Descriptions>
      <Descriptions.Item label='Type'>{exportTypeToText(type)}</Descriptions.Item>
    </Descriptions>
  )
}

export default ExportCommon
