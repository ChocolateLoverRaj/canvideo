import createCanvas from '../createCanvas'
import never from 'never'
import { Operations } from 'canvideo/lib/operations'
import renderFrame from 'canvideo/dist/render-frame'
import Writer from 'webm-writer'
import { ObservablePromise } from 'mobx-observable-promise'

class WebmWriterExport {
  readonly generateBlob: ObservablePromise<() => Promise<string>>

  constructor (
    frames: Operations[][],
    fps: number,
    readonly width: number,
    readonly height: number
  ) {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d') ?? never('No 2d')
    const writer = new Writer({ frameRate: fps })
    frames.forEach(frame => {
      renderFrame(ctx, frame)
      writer.addFrame(canvas)
    })
    this.generateBlob = new ObservablePromise(async () => {
      return URL.createObjectURL(await writer.complete())
    })
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.generateBlob.execute().catch()
  }
}

export default WebmWriterExport
