import { FC, useEffect, useState } from 'react'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import never from 'never'
import renderFrame from 'canvideo/dist/render-frame'
import { Operations } from 'canvideo/lib/operations'

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

  useEffect(() => {
    const { load, FS, run } = createFFmpeg();
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
      for (let i = 0; i < 300; i++) {
        frames.push([
          ['setFillStyle', ['white']],
          ['fillRect', [0, 0, 300, 300]],
          ['setFillStyle', ['green']],
          ['fillRect', [0, 0, i, i]]
        ])
      }
      await Promise.all(frames.map(async (frame, index) => {
        ctx.clearRect(0, 0, 300, 300)
        renderFrame(ctx, frame)
        FS('writeFile', `test${index}.png`, await canvasToPng(canvas))
      }))
      await run('-r', '30', '-i', 'test%01d.png', '-an', '-vcodec', 'libx264', '-pix_fmt', 'yuv420p', 'output.mp4')
      setUrl(URL.createObjectURL(new Blob([FS('readFile', 'output.mp4')], { type: 'video/mp4' })))

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

  return url !== undefined
    ? (
      <video width={300} height={300} controls>
        <source type='video/mp4' src={url} />
      </video>
    )
    : <>Generating video</>
}

export default App
