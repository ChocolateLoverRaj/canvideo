import { Operations, OperationsInterface } from '../types/Operations'

type DrawType = {
  [O in keyof OperationsInterface]: (ctx: CanvasRenderingContext2D, operation: OperationsInterface[O]) => void
}

const Draw: DrawType = {
  fillRect: (ctx, [x, y, width, height]) => {
    ctx.fillRect(x, y, width, height)
  },
  setFillStyle: (ctx, [color]) => {
    ctx.fillStyle = color
  }
}

const renderFrame = (ctx: CanvasRenderingContext2D, frame: Operations[]): void => {
  for (const [operationName, operationData] of frame) {
    Draw[operationName](ctx, operationData as never)
  }
}

export default renderFrame
