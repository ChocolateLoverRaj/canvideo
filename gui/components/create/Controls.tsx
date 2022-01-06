import { FC } from 'react'
import ButtonsDiv from './ButtonsDiv'
import VideoProgressBar from './video-progress-bar'

const Controls: FC = () => {
  return (
    <>
      <VideoProgressBar />
      <ButtonsDiv />
    </>
  )
}

export default Controls
