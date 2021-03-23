import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Export, Exports, ExportStates, RecordingExport } from '../states/Exports'
import never from 'never'
import renderFrame from 'canvideo/dist/render-frame'
import spf from '../lib/spf'

export type ExportsState = [Exports, Dispatch<SetStateAction<Exports>>]

const useExports = (): ExportsState => {
  const exportsState = useState<Exports>(new Set())
  const [exports, setExports] = exportsState

  // Array of exports
  const exportsArr = useMemo(() => [...exports], [exports])

  // Request animation frame
  useEffect(() => {
    const isWaiting = ({ state }: Export): boolean => state === ExportStates.WAITING_FOR_ANIMATION_FRAME
    if (exportsArr.find(isWaiting) !== undefined) {
      const handle = requestAnimationFrame(() => {
        setExports(new Set(exportsArr
          .map<Export>(currentExport => {
          const { canvas, currentFrame, frames, recorder, width, height, track } = currentExport
          if (!isWaiting(currentExport)) return currentExport
          const ctx = canvas.getContext('2d') ?? never('No 2d')
          ctx.clearRect(0, 0, width, height)
          renderFrame(ctx, frames[currentFrame])
          track.requestFrame()
          recorder.resume()
          return {
            ...currentExport,
            state: ExportStates.RECORDING_FRAME,
            currentFrame,
            startTime: Date.now()
          }
        })))
      })
      return () => {
        cancelAnimationFrame(handle)
      }
    }
  }, [exportsArr, setExports])

  // Recording frame
  useEffect(() => {
    const isRecording = ({ state }: Export): boolean => state === ExportStates.RECORDING_FRAME
    const handles = exportsArr
      .filter(isRecording)
      .map(({ startTime, fps, recorder, frames, currentFrame, track }: RecordingExport) => setTimeout(() => {
        recorder.pause()
        setExports(new Set(exportsArr
          .map(currentExport => {
            if (!isRecording(currentExport)) return currentExport
            const isComplete = currentFrame === frames.length - 1
            if (isComplete) {
              track.stop()
            }
            return {
              ...currentExport,
              currentFrame: currentFrame + 1,
              state: isComplete
                ? ExportStates.WAITING_FOR_DATA
                : ExportStates.WAITING_FOR_ANIMATION_FRAME
            }
          }))
        )
      }, (startTime + spf(fps) * 1000) - Date.now()))
    return () => {
      handles.forEach(handle => {
        clearTimeout(handle)
      })
    }
  }, [exportsArr, setExports])

  // On data available
  useEffect(() => {
    const isWaiting = ({ state }: Export): boolean => state === ExportStates.WAITING_FOR_DATA
    const cancelEffects = exportsArr
      .filter(isWaiting)
      .map(({ recorder }) => {
        const eventListener = ({ data }: any): void => {
          const url = URL.createObjectURL(data)
          setExports(new Set(exportsArr.map(currentExport => {
            if (!isWaiting(currentExport)) return currentExport
            return {
              ...currentExport,
              state: ExportStates.COMPLETE,
              url
            }
          })))
        }
        recorder.addEventListener('dataavailable', eventListener)
        return () => {
          recorder.removeEventListener('dataavailable', eventListener)
        }
      })
    return () => {
      cancelEffects.forEach(cancelEffect => {
        cancelEffect()
      })
    }
  })

  return exportsState
}

export default useExports
