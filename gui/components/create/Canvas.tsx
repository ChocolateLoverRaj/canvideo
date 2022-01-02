import { FC, useContext } from 'react'
import CanvasSuccess from './CanvasSuccess'
import CanvasProps from './CanvasProps'
import VideoPlayerContext from './ControlsContext'
import CanvasError from './CanvasError'

const Canvas: FC<CanvasProps> = props => {
  const { renderer } = useContext(VideoPlayerContext)

  return (
    <>
      {renderer !== undefined
        ? <CanvasSuccess {...props} />
        : <CanvasError />}
    </>
  )
}

export default Canvas
