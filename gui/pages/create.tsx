import { Dropdown, Menu, message } from 'antd'
import { Operations } from 'canvideo/lib/operations'
import { useCallback } from 'react'
import HeadTitle from '../components/HeadTitle'
import createExport from '../lib/createExport'
import exportTypes from '../lib/exportTypes'
import exportTypeToText from '../lib/exportTypeToText'
import mainTitle from '../lib/mainTitle'
import ExportTypes from '../types/ExportTypes'
import { action } from 'mobx'
import exports from '../mobx/exportsStore'
import defaultMethodStore from '../mobx/defaultMethodStore'
import { observer } from 'mobx-react-lite'
import Create from '../components/create'

const App = observer(() => {
  const createSample = action((type: ExportTypes) => {
    const frames: Operations[][] = []
    for (let i = 0; i < 300; i++) {
      frames.push([
        ['setFillStyle', ['white']],
        ['fillRect', [0, 0, 300, 300]],
        ['setFillStyle', ['green']],
        ['fillRect', [0, 0, i, i]]
      ])
    }
    exports.exports.push(createExport(frames, 30, 300, 300, type))
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    message.info('Started creating video')
  })

  const createDefault = useCallback(() => {
    createSample(defaultMethodStore.defaultMethod)
  }, [createSample])

  return (
    <>
      <HeadTitle paths={[mainTitle, 'Create']} />
      <Create />
    </>
  )
})

export default App
