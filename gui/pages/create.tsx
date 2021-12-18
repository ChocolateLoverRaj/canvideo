import { Dropdown, Menu, message } from 'antd'
import { Operations } from 'canvideo/lib/operations'
import { FC, useCallback } from 'react'
import HeadTitle from '../components/HeadTitle'
import createExport from '../lib/createExport'
import exportTypes from '../lib/exportTypes'
import exportTypeToText from '../lib/exportTypeToText'
import mainTitle from '../lib/mainTitle'
import ExportTypes from '../types/ExportTypes'
import { action } from 'mobx'
import exports from '../mobx/exportsStore'

const App: FC = () => {
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
    // TODO: Use localStorage for default setting
    createSample(ExportTypes.WEBM_WRITER)
  }, [createSample])

  return (
    <>
      <HeadTitle paths={[mainTitle, 'Create']} />
      Create page will be have an editor eventually.
      For now, you can create a sample video.
      <br />
      <Dropdown.Button
        onClick={createDefault}
        overlay={
          <Menu>
            {exportTypes.map(exportType => {
              const handleClick = (): void => {
                createSample(exportType)
              }
              return (
                <Menu.Item key={exportType} onClick={handleClick}>Create with {exportTypeToText(exportType)}</Menu.Item>
              )
            })}
          </Menu>
        }
      >
        Create Sample Video
      </Dropdown.Button>
    </>
  )
}

export default App
