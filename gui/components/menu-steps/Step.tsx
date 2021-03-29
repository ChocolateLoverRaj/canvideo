import { FC, ReactNode } from 'react'
import { StepProps as AntdStepProps } from 'antd'

export interface StepProps extends AntdStepProps {
  children?: ReactNode
}

const MenuStep: FC<StepProps> = () => null

export default MenuStep
