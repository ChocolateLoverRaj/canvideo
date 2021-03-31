import { FC, useCallback, useContext } from 'react'
import { ExportTypes } from '../states/Exports'
import GlobalContext from '../contexts/Global'
import createExport from '../lib/createExport'
import exportTypes from '../lib/exportTypes'
import exportTypeToText from '../lib/exportTypeToText'
import { Dropdown, Menu, message } from 'antd'
import { Operations } from 'canvideo/lib/operations'

const CreateSample: FC = () => {
  const { exports: [exports, setExports] } = useContext(GlobalContext)

  const createSample = useCallback((type: ExportTypes) => {
    const frames: Operations[][] = []
    for (let i = 0; i < 300; i++) {
      frames.push([
        ['setFillStyle', ['white']],
        ['fillRect', [0, 0, 300, 300]],
        ['setFillStyle', ['green']],
        ['fillRect', [0, 0, i, i]]
      ])
    }
    setExports(new Set([...exports, createExport(frames, 30, 300, 300, type)]))
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    message.info('Started creating video')
  }, [exports, setExports])

  const createDefault = useCallback(() => {
    // TODO: Use localStorage for default setting
    createSample(ExportTypes.WEBM_WRITER)
  }, [createSample])

  return (
    <>
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

export default CreateSample
