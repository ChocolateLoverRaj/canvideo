import { FC } from 'react'
import ButtonsDiv from './ButtonsDiv'
import VideoProgressBar from './VideoProgressBar'

const Controls: FC = () => {
  return (
    <>
      <VideoProgressBar />
      <ButtonsDiv />
    </>
  )
}

export default Controls
