import { useContext } from 'react'
import CanvasSuccess from './CanvasSuccess'
import CanvasProps from './CanvasProps'
import VideoPlayerContext from './VideoPlayerContext'
import CanvasError from './CanvasError'
import { observer } from 'mobx-react-lite'
import CanvasLoading from './CanvasLoading'

const Canvas = observer<CanvasProps>(props => {
  const { renderer } = useContext(VideoPlayerContext)

  return (
    <>
      {renderer.wasSuccessful
        ? <CanvasSuccess {...props} />
        : renderer.isExecuting
          ? <CanvasLoading />
          : <CanvasError error={renderer.error} />}
    </>
  )
})

export default Canvas
