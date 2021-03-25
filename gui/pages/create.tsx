import { Dropdown, Menu, message } from 'antd'
import { Operations } from 'canvideo/lib/operations'
import { FC, useCallback, useContext } from 'react'
import HeadTitle from '../components/HeadTitle'
import GlobalContext from '../contexts/Global'
import createExport from '../lib/createExport'
import mainTitle from '../lib/mainTitle'

const App: FC = () => {
  const { exports: [exports, setExports] } = useContext(GlobalContext)

  const handleClick = useCallback(() => {
    const frames: Operations[][] = []
    for (let i = 0; i < 300; i++) {
      frames.push([
        ['setFillStyle', ['white']],
        ['fillRect', [0, 0, 300, 300]],
        ['setFillStyle', ['green']],
        ['fillRect', [0, 0, i, i]]
      ])
    }
    setExports(new Set([...exports, createExport(frames, 30, 300, 300)]))
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    message.info('Started creating video')
  }, [exports, setExports])

  return (
    <>
      <HeadTitle paths={[mainTitle, 'Create']} />
      Create page will be have an editor eventually.
      For now, you can create a sample video.
      <br />
      <Dropdown.Button
        onClick={handleClick}
        overlay={
          <Menu>
            <Menu.Item onClick={handleClick}>Create with MediaRecorder</Menu.Item>
            <Menu.Item disabled>Create with in browser FFmpeg</Menu.Item>
          </Menu>
        }
      >
        Create Sample Video
      </Dropdown.Button>
    </>
  )
}

export default App
