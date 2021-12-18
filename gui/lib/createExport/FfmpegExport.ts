import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { ObservablePromise } from 'mobx-observable-promise'
import { Operations } from 'canvideo/lib/operations'
import { action, makeObservable, observable, runInAction } from 'mobx'
import createCanvas from '../createCanvas'
import never from 'never'
import renderFrame from 'canvideo/dist/render-frame'
import canvasToPng from '../canvasToPng'

class FfmpegExport {
  readonly promise: ObservablePromise<() => Promise<Uint8Array>>
  loaded = false
  renderedFrames = 0
  readonly totalFrames: number
  ffmpegProgress = 0

  constructor (
    frames: Operations[][],
    fps: number,
    readonly width: number,
    readonly height: number
  ) {
    this.totalFrames = frames.length
    const ffmpeg = createFFmpeg({
      progress: action(({ ratio }) => {
        this.ffmpegProgress = ratio
      })
    })
    this.promise = new ObservablePromise(async () => {
      await ffmpeg.load()
      this.loaded = true
      await Promise.all(frames.map(async (frame, index) => {
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d') ?? never('No 2d')
        renderFrame(ctx, frame)
        ffmpeg.FS('writeFile', `${index}.png`, await canvasToPng(canvas))
        runInAction(() => {
          this.renderedFrames++
        })
      }))
      await ffmpeg.run(
        '-r',
        fps.toString(),
        '-i',
        '%01d.png',
        '-an',
        '-vcodec',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        'video.mp4'
      )
      return ffmpeg.FS('readFile', 'video.mp4')
    })
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.promise.execute().catch()

    makeObservable(this, {
      loaded: observable,
      renderedFrames: observable,
      ffmpegProgress: observable
    })
  }
}

export default FfmpegExport
