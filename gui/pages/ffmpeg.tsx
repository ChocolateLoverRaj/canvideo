import { FC, useEffect, useState } from 'react'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import never from 'never'
import renderFrame from 'canvideo/dist/render-frame'
import { Operations } from 'canvideo/lib/operations'
import { Progress } from 'antd'

const canvasToPng = async (canvas: HTMLCanvasElement): Promise<Uint8Array> => await new Promise((resolve, reject) => {
  canvas.toBlob(blob => {
    if (blob !== null) {
      blob.arrayBuffer()
        .then(arrayBuffer => new Uint8Array(arrayBuffer))
        .then(resolve, reject)
    } else {
      reject(new Error('No blob'))
    }
  })
})

const App: FC = () => {
  const [url, setUrl] = useState<string>()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const { load, FS, run } = createFFmpeg({
      progress: ({ ratio }) => {
        setProgress(ratio)
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      console.log('loading ffmpeg')
      await load()
      console.log('loaded ffmpeg')

      const canvas = document.createElement('canvas')
      canvas.width = 300
      canvas.height = 300
      const ctx = canvas.getContext('2d') ?? never('no 2d')
      const frames: Operations[][] = []
      for (let i = 0; i < 1000; i++) {
        frames.push([
          ['setFillStyle', ['white']],
          ['fillRect', [0, 0, 300, 300]],
          ['setFillStyle', ['green']],
          ['fillRect', [0, 0, i, i]]
        ])
      }
      let totalSize = 0
      await Promise.all(frames.map(async (frame, index) => {
        ctx.clearRect(0, 0, 300, 300)
        renderFrame(ctx, frame)
        const arr = await canvasToPng(canvas)
        totalSize += arr.length
        FS('writeFile', `test${index}.png`, arr)
      }))
      await run('-r', '60', '-i', 'test%01d.png', '-an', '-vcodec', 'libx264', '-pix_fmt', 'yuv420p', 'output.mp4')
      const videoArr = FS('readFile', 'output.mp4')
      console.log('frames size', totalSize)
      console.log('video size', videoArr.length)
      setUrl(URL.createObjectURL(new Blob([videoArr], { type: 'video/mp4' })))

      /* ctx.fillStyle = 'green'
      ctx.fillRect(0, 0, 200, 200)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      canvas.toBlob(async blob => {
        const arrayBuffer = await (blob ?? never('no blob')).arrayBuffer()
        FS('writeFile', 'test.png', new Uint8Array(arrayBuffer))
        const data = FS('readFile', 'test.png')
        console.log(data)
        console.log(URL.createObjectURL(new Blob([data], {
          type: 'image/png'
        })))
      }) */
    })()
  }, [])

  const percent = Math.floor(progress * 100 * 100) / 100
  return url !== undefined
    ? (
      <video width={300} height={300} controls>
        <source type='video/mp4' src={url} />
      </video>
    )
    : (
      <>
        Generating video
        <Progress success={{ percent }} percent={percent} />
      </>
    )
}

export default App
