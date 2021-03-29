import { FC, useEffect, useState } from 'react'
import never from 'never'
import renderFrame from 'canvideo/dist/render-frame'
import { Operations } from 'canvideo/lib/operations'
import { Spin } from 'antd'
import WebMWriter from 'webm-writer'

const App: FC = () => {
  const [url, setUrl] = useState<string>()

  useEffect(() => {
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

    const videoWriter = new WebMWriter({ frameRate: 60 })
    for (const frame of frames) {
      renderFrame(ctx, frame)
      videoWriter.addFrame(canvas)
    }
    videoWriter.complete()
      .then(blob => {
        setUrl(URL.createObjectURL(blob))
      })
      .catch(() => {
        alert('Error creating video')
      })
  }, [])

  return url !== undefined
    ? (
      <video width={300} height={300} controls>
        <source type='video/webm' src={url} />
      </video>
    )
    : <Spin size='large' tip='Generating Video' />
}

export default App
