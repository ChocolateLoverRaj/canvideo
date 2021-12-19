import { useCallback } from 'react'
import { Radio, RadioChangeEvent } from 'antd'
import exportTypes from '../../lib/exportTypes'
import exportTypeToText from '../../lib/exportTypeToText'
import defaultMethodStore from '../../mobx/defaultMethodStore'
import { observer } from 'mobx-react-lite'

const Client = observer(() => {
  const handleChange = useCallback(({ target: { value } }: RadioChangeEvent) => {
    defaultMethodStore.defaultMethod = value
  }, [])

  return (
    <Radio.Group value={defaultMethodStore.defaultMethod} onChange={handleChange}>
      {exportTypes.map(exportType => (
        <Radio key={exportType} value={exportType}>Use {exportTypeToText(exportType)}</Radio>
      ))}
    </Radio.Group>
  )
})

export default Client
