import { Button, ButtonProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useContext } from 'react'
import VideoPlayerContext from './VideoPlayerContext'
import { action } from 'mobx'

const PauseButton = observer<ButtonProps>(props => {
  const { playerStore } = useContext(VideoPlayerContext)

  return (
    <Button
      {...props}
      icon={playerStore.paused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
      onClick={action(() => {
        playerStore.paused = !playerStore.paused
      })}
    />
  )
})

export default PauseButton
