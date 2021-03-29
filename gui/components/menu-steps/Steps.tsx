import { Steps, StepsProps } from 'antd'
import { FC, ReactNode, useState } from 'react'
import toArray from 'rc-util/lib/Children/toArray'
import { StepProps } from './Step'
import MainColor from '../MainColor'

interface Props extends StepsProps {
  children?: ReactNode
  current: number
}

/**
 * Like an antd <Menu /> and <Steps /> at the same time
 */
const MenuSteps: FC<Props> = props => {
  const { children, current } = props

  const [selectedStep, setSelectedStep] = useState<number>()

  const steps = toArray(children)
  const shownStep = selectedStep ?? current

  return (
    <>
      <Steps
        {...props}
        type='navigation'
        current={shownStep}
        onChange={setSelectedStep}
      >
        {steps.map((step, i) => {
          const { props } = step
          const { title } = props as StepProps
          return (
            <Steps.Step
              {...step.props}
              key={i}
              status={current < i ? 'wait' : current === i ? 'process' : 'finish'}
              title={title !== undefined ? <MainColor isMainColor={shownStep === i}>{title}</MainColor> : undefined}
              disabled={i > current}
            />
          )
        })}
      </Steps>
      {(steps[shownStep].props as StepProps).children}
    </>
  )
}

export default MenuSteps
