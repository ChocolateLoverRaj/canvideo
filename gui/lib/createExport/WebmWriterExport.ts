import createCanvas from '../createCanvas'
import never from 'never'
import { Operations } from 'canvideo/lib/operations'
import renderFrame from 'canvideo/dist/render-frame'
import Writer from 'webm-writer'
import { ObservablePromise } from 'mobx-observable-promise'
import { makeObservable, observable, runInAction } from 'mobx'

class WebmWriterExport {
  readonly promise: ObservablePromise<() => Promise<string>>
  renderedFrames = 0
  readonly totalFrames: number

  constructor (
    frames: Operations[][],
    fps: number,
    readonly width: number,
    readonly height: number
  ) {
    this.totalFrames = frames.length
    this.promise = new ObservablePromise(async () => {
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d') ?? never('No 2d')
      const writer = new Writer({ frameRate: fps })
      for (const frame of frames) {
        await new Promise(resolve => setTimeout(resolve))
        renderFrame(ctx, frame)
        await new Promise(resolve => setTimeout(resolve))
        writer.addFrame(canvas)
        runInAction(() => {
          this.renderedFrames++
        })
      }
      return URL.createObjectURL(await writer.complete())
    })
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.promise.execute().catch()

    makeObservable(this, {
      renderedFrames: observable
    })
  }
}

export default WebmWriterExport
