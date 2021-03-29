import { ExportTypes, WebmExportStates } from '../../states/Exports'
import createCanvas from '../createCanvas'
import WebmWriter from 'webm-writer'
import { CreateFn } from './types'

const createExportWebm: CreateFn = (frames, fps, width, height) => ({
  type: ExportTypes.WEBM_WRITER,
  data: {
    state: WebmExportStates.RENDERING_FRAMES,
    frames: frames,
    completedFrames: 0,
    width,
    height,
    canvas: createCanvas(width, height),
    videoWriter: new WebmWriter({ frameRate: fps })
  }
})

export default createExportWebm
