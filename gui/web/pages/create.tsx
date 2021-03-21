import ApiProps from '../lib/api-props'
import BasePage from 'gui/pages/create'
import { FC, useEffect, useRef, useState } from 'react'
import renderFrame from 'canvideo/dist/render-frame'
import { Operations } from 'canvideo/lib/operations'
import never from 'never'
import { time } from '../lib/waitPlease'

declare const MediaRecorder: any

const App: FC<ApiProps> = props => {
  const [videoUrl, setVideoUrl] = useState<string>()

  useEffect(() => {
    // const { current: canvas } = ref
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    if (canvas !== null) {
      (async () => {
        const frames: Operations[][] = []
        for (let i = 0; i < 100; i++) {
          frames.push([
            ['setFillStyle', ['white']],
            ['fillRect', [0, 0, 100, 100]],
            ['setFillStyle', ['green']],
            ['fillRect', [0, 0, 100, i]]
          ])
        }

        const ctx = canvas.getContext('2d') ?? never('No 2d')
        // Idk if this does anything
        ctx.fillRect(0, 0, 0, 0)
        const stream = (canvas as any).captureStream(0) as MediaStream
        const [track] = stream.getVideoTracks()

        const recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm'
        })

        recorder.start()

        recorder.addEventListener('dataavailable', ({ data }) => {
          setVideoUrl(URL.createObjectURL(data))
        })

        for (const frame of frames) {
          ctx.clearRect(0, 0, 100, 100)
          const timer = time(100)
          renderFrame(ctx, frame);
          (track as any).requestFrame()
          await timer
        }
        track.stop()
        console.log('stopped')
      })().catch(console.error)
    }
  }, [])

  return (
    <>
      {videoUrl !== undefined
        ? (
          <video width={500} height={500} controls>
            <source type='video/webm' src={videoUrl} />
          </video>
        )
        : <p>Generating video</p>}
    </>
  )
}

export default App

export { getStaticProps } from '../lib/apiGetStaticProps'
