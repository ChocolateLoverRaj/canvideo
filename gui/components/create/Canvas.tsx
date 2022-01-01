import { FC, useContext } from 'react'
import CanvasSuccess from './CanvasSuccess'
import CanvasProps from './CanvasProps'
import CreateContext from './CreateContext'

const Canvas: FC<CanvasProps> = props => {
  const [code] = useContext(CreateContext)

  let video: any
  try {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    video = new Function(code)()
  } catch (e) {
    console.error(e)
  }

  return (
    <>
      {video !== undefined
        ? <CanvasSuccess {...props} video={video} />
        : 'Error'}
    </>
  )
}

export default Canvas
