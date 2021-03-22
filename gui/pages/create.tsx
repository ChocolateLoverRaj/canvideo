import { Button, message } from 'antd'
import { Operations } from 'canvideo/lib/operations'
import { FC, MouseEventHandler, useCallback, useContext } from 'react'
import ExportsContext from '../contexts/Exports'
import createExport from '../lib/createExport'

const App: FC = () => {
  const [exports, setExports] = useContext(ExportsContext)

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    const frames: Operations[][] = []
    for (let i = 0; i < 50; i++) {
      frames.push([
        ['setFillStyle', ['white']],
        ['fillRect', [0, 0, 50, 50]],
        ['setFillStyle', ['green']],
        ['fillRect', [0, 0, 50, i]]
      ])
    }
    setExports(new Set([...exports, createExport(frames, 10, 100, 100)]))
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
