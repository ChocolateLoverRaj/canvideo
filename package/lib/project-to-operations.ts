import { Operations } from './operations'
import type { ProjectSchema, Shape, Rectangle, ColoredShape } from '../dist/project.schema'

type Shapes = {
  [S in Shape[keyof Shape]]: (shape: any) => Operations[]
}

const shapeToOperations: Shapes = {
  rectangle: ({ x, y, width, height }: Rectangle) => [['fillRect', [x, y, width, height]]],
  coloredShape: ({ color, shape }: ColoredShape) => [['setFillStyle', [color]], ...shapeToOperations[shape.type](shape)]
}

const projectToOperations = (project: ProjectSchema, fps: number): Operations[][] => {
  const timeline = project.timeline
  // Calculate duration
  const duration = Math.max(...timeline.map(
    ({ start, duration }) => start + duration
  ))
  const operations: Operations[][] = []
  const spf = 1 / fps
  for (let frame = 0; frame < duration * fps; frame++) {
    const time = frame * spf
    // Get shapes to render
    const shapes = timeline.filter(
      ({ start, duration }) => start <= time && start + duration > time
    )
    operations.push(shapes.map(({ shape }) => shapeToOperations[shape.type](shape)).flat(1))
  }
  return operations
}

export default projectToOperations
