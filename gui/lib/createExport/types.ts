import { Operations } from 'canvideo/lib/operations'
import { Export } from '../../states/Exports'

export type CreateFn = (frames: Operations[][], fps: number, width: number, height: number) => Export
