import renderFrame from 'canvideo/dist/render-frame'
import never from 'never'
import { WebmExportData, WebmExportStates } from '../../states/Exports'
import { HandleData } from './types'

const handleWebm: HandleData<WebmExportData> = (data, setData) => {
  const { state, canvas, frames, completedFrames, videoWriter, generatePromise } = data
  if (state === WebmExportStates.RENDERING_FRAMES) {
    const handle = setTimeout(() => {
      const ctx = canvas.getContext('2d') ?? never('No 2d')
      renderFrame(ctx, frames[completedFrames])
      videoWriter.addFrame(canvas)
      const newCompletedFrames = completedFrames + 1
      setData({
        ...data,
        completedFrames: newCompletedFrames,
        ...newCompletedFrames === frames.length
          ? {
            state: WebmExportStates.GENERATING_BLOB,
            generatePromise: videoWriter.complete()
          }
          : undefined
      })
    })
    return () => {
      clearTimeout(handle)
    }
  }
  generatePromise
    ?.then(blob => {
      setData({
        ...data,
        generatePromise: undefined,
        state: WebmExportStates.COMPLETE,
        url: URL.createObjectURL(blob)
      })
    })
    .catch(() => {
      alert('Error generating blob')
    })
}

export default handleWebm
