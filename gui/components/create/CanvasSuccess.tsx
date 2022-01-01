import { FC } from 'react'
import maximizeWithRatio from '../../lib/maximizeWithRatio'
import CanvasProps from './CanvasProps'
import styles from './CanvasSuccess.module.css'

export interface CanvasSuccessProps extends CanvasProps {
  video: any
}

const CanvasSuccess: FC<CanvasSuccessProps> = ({ availableSpace, video }) => {
  const scaledSize = maximizeWithRatio(video, availableSpace)

  return (
    <>
      {video !== undefined
        ? (
          <canvas
            width={video.width}
            height={video.height}
            style={scaledSize}
            className={styles.canvas}
          />)
        : 'Error'}
    </>
  )
}

export default CanvasSuccess
