import { Operations } from '../../types/Operations'

export interface FixedSize {
  type: 'fixed'
  width: number
  height: number
}

export interface AspectRatioSize {
  type: 'ratio'
  widthDividedByHeight: number
}

export interface DynamicRatioSize {
  type: 'dynamicRatio'
  minWidthDividedByHeight: number
  maxWidthDividedByHeight: number
}

export interface VideoRenderer {
  render: (time: number) => Promise<Operations[]>
  size: FixedSize | AspectRatioSize | DynamicRatioSize
  duration?: number
}
