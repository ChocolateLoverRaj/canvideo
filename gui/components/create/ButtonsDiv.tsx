import { ButtonProps } from 'antd'
import { FC } from 'react'
import GoToStartButton from './GoToStartButton'
import PauseButton from './PauseButton'

const ButtonsDiv: FC = () => {
  const commonProps: ButtonProps = {
    shape: 'circle',
    type: 'text'
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <GoToStartButton {...commonProps} />
      <PauseButton {...commonProps} />
    </div>
  )
}

export default ButtonsDiv
