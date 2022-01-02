import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import VideoPlayerContext from './ControlsContext'
import { Button, ButtonProps } from 'antd'
import { StepBackwardOutlined } from '@ant-design/icons'
import { action } from 'mobx'

const GoToStartButton = observer<ButtonProps>(props => {
  const { playerStore } = useContext(VideoPlayerContext)

  return (
    <Button
      {...props}
      icon={<StepBackwardOutlined />}
      onClick={action(() => {
        playerStore.time = 0
      })}
    />
  )
})

export default GoToStartButton
