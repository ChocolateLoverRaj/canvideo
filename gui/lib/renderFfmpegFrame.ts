import renderFrame from 'canvideo/dist/render-frame'
import never from 'never'
import { FfmpegExportData } from '../states/Exports'
import canvasToPng from './canvasToPng'

const renderFfmpegFrame = (data: FfmpegExportData): Partial<FfmpegExportData> => {
  const { frames, completedFrames } = data
  const canvas = data.canvas ?? document.createElement('canvas')
  const ctx = canvas.getContext('2d') ?? never('No 2d')
  renderFrame(ctx, frames[completedFrames + 1])
  return {
    canvas,
    renderPromise: canvasToPng(canvas)
  }
}

export default renderFfmpegFrame
