import renderFrame from 'canvideo/dist/render-frame'
import never from 'never'
import { useEffect, useMemo } from 'react'
import { ExportTypes, RecorderExportData, RecorderExportStates, RecorderExport, RecorderRecordingExport } from '../states/Exports'
import { ExportsState } from '../types/ExportsState'
import spf from '../lib/spf'
import recorderDataMapFn from '../lib/recorderDataMapFn'

const exportMapFn = (data: RecorderExportData): RecorderExport => ({ type: ExportTypes.MEDIA_RECORDER, data })

const useExportsRecorder = (exportsState: ExportsState): void => {
  const [exports, setExports] = exportsState

  // Array of exports
  const exportsArr = useMemo(
    () => [...exports]
      .filter(({ type }) => type === ExportTypes.MEDIA_RECORDER)
      .map(recorderDataMapFn),
    [exports]
  )

  // Request animation frame
  useEffect(() => {
    const isWaiting = ({ state }: RecorderExportData): boolean => state === RecorderExportStates.WAITING_FOR_ANIMATION_FRAME
    if (exportsArr.find(isWaiting) !== undefined) {
      const handle = requestAnimationFrame(() => {
        setExports(new Set(exportsArr
          .map<RecorderExportData>(currentExport => {
          const { canvas, currentFrame, frames, recorder, width, height, track } = currentExport
          if (!isWaiting(currentExport)) return currentExport
          const ctx = canvas.getContext('2d') ?? never('No 2d')
          ctx.clearRect(0, 0, width, height)
          renderFrame(ctx, frames[currentFrame])
          track.requestFrame()
          recorder.resume()
          return {
            ...currentExport,
            state: RecorderExportStates.RECORDING_FRAME,
            currentFrame,
            startTime: Date.now()
          }
        })
          .map<RecorderExport>(exportMapFn)))
      })
      return () => {
        cancelAnimationFrame(handle)
      }
    }
  }, [exportsArr, setExports])

  // Recording frame
  useEffect(() => {
    const isRecording = ({ state }: RecorderExportData): boolean => state === RecorderExportStates.RECORDING_FRAME
    const handles = exportsArr
      .filter(isRecording)
      .map(({ startTime, fps, recorder, frames, currentFrame, track }: RecorderRecordingExport) => setTimeout(() => {
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
                ? RecorderExportStates.WAITING_FOR_DATA
                : RecorderExportStates.WAITING_FOR_ANIMATION_FRAME
            }
          })
          .map(exportMapFn))
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
    const isWaiting = ({ state }: RecorderExportData): boolean => state === RecorderExportStates.WAITING_FOR_DATA
    const cancelEffects = exportsArr
      .filter(isWaiting)
      .map(({ recorder }) => {
        const eventListener = ({ data }: any): void => {
          const url = URL.createObjectURL(data)
          setExports(new Set(exportsArr
            .map(currentExport => {
              if (!isWaiting(currentExport)) return currentExport
              return {
                ...currentExport,
                state: RecorderExportStates.COMPLETE,
                url
              }
            })
            .map(exportMapFn)))
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
}

export default useExportsRecorder
