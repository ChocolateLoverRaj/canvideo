import { Operations } from './operations'

interface Shapes {
  [shape: string]: (shape: any) => Operations[]
}

const shapeToOperations: Shapes = {
  rectangle: ({ x, y, width, height }) => [['fillRect', [x, y, width, height]]],
  coloredShape: ({ color, shape }) => [['setFillStyle', [color]], ...shapeToOperations[shape.type](shape)]
}

const projectToOperations = (project: any, fps: number): Operations[][] => {
  const timeline = project.timeline
  // Calculate duration
  const duration = Math.max(...timeline.map(
    ({ start, duration }: { start: number, duration: number }) => start + duration
  ))
  const operations: Operations[][] = []
  const spf = 1 / fps
  for (let frame = 0; frame < duration * fps; frame++) {
    const time = frame * spf
    // Get shapes to render
    const shapes = timeline.filter(
      ({ start, duration }: { start: number, duration: number }) => start <= time && start + duration > time
    )
    operations.push(shapes.map(({ shape }: any) => shapeToOperations[shape.type](shape)).flat(1))
  }
  return operations
}

export default projectToOperations
