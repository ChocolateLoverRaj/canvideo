import { useEffect, useMemo } from 'react'
import { ExportTypes, FfmpegExportData, FfmpegExportStates } from '../states/Exports'
import { ExportsState } from '../types/ExportsState'
import dataMapFn from '../lib/dataMapFn'
import indexMapFn, { PreservedIndex } from '../lib/indexMapFn'
import renderFfmpegFrame from '../lib/renderFfmpegFrame'

const useExportsFfmpeg = (exportsState: ExportsState): void => {
  const [exports, setExports] = exportsState

  // Array of exports
  const exportsArr = useMemo(
    () => [...exports],
    [exports]
  )

  const exportsArrFfmpeg: Array<PreservedIndex<FfmpegExportData>> = useMemo(
    () => exportsArr
      .map(indexMapFn)
      .filter(([{ type }]) => type === ExportTypes.FFMPEG)
      .map(([v, i]) => [dataMapFn(v), i]),
    [exportsArr]
  )

  // Load FFmpeg
  useEffect(() => {
    let canceled = false

    exportsArrFfmpeg
      .forEach(([data, i]) => {
        const {
          loadPromise,
          renderPromise,
          ffmpeg: { FS },
          completedFrames,
          frames
        } = data

        loadPromise
          ?.then(() => {
            if (canceled) return
            setExports(new Set([
              ...exportsArr.slice(0, i),
              {
                type: ExportTypes.FFMPEG,
                data: {
                  ...data,
                  state: FfmpegExportStates.CREATING_PNG,
                  ...renderFfmpegFrame(data),
                  loadPromise: undefined
                }
              },
              ...exportsArr.slice(i + 1)
            ]))
          })
          .catch(() => {
            alert('Error loading ffmpeg')
          })

        renderPromise
          ?.then(buffer => {
            if (canceled) return
            FS('writeFile', `${i}-${completedFrames + 1}`, buffer)
            setExports(new Set([
              ...exportsArr.slice(0, i),
              {
                type: ExportTypes.FFMPEG,
                data: {
                  ...data,
                  ...completedFrames + 1 < frames.length
                    ? renderFfmpegFrame(data)
                    : {
                      state: FfmpegExportStates.GENERATING_VIDEO,
                      canvas: undefined,
                      renderPromise: undefined
                    },
                  completedFrames: completedFrames + 1
                }
              },
              ...exportsArr.slice(i + 1)
            ]))
          })
          .catch(() => {
            alert('Error creating PNG blob')
          })
      })

    return () => {
      canceled = true
    }
  }, [exportsArr, exportsArrFfmpeg, setExports])
}

export default useExportsFfmpeg
