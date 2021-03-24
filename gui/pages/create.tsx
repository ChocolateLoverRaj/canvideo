import { Button, message } from 'antd'
import { Operations } from 'canvideo/lib/operations'
import { FC, MouseEventHandler, useCallback, useContext } from 'react'
import GlobalContext from '../contexts/Global'
import createExport from '../lib/createExport'

const App: FC = () => {
  const { exports: [exports, setExports] } = useContext(GlobalContext)

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
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
      Create page will be have an editor eventually.
      For now, you can create a sample video.
      <br />
      <Button onClick={handleClick}>Create Sample Video</Button>
    </>
  )
}

export default App
