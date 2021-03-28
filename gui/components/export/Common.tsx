import { FC } from 'react'
import { Export } from '../../states/Exports'
import exportTypeToText from '../../lib/exportTypeToText'
import { Descriptions } from 'antd'

export interface ExportCommonProps {
  export: Export
}

const ExportCommon: FC<ExportCommonProps> = props => {
  const { export: { type } } = props

  return (
    <Descriptions>
      <Descriptions.Item label='Type'>{exportTypeToText(type)}</Descriptions.Item>
    </Descriptions>
  )
}

export default ExportCommon
