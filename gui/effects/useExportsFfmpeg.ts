import { useEffect, useMemo } from 'react'
import { ExportTypes, FfmpegExportData, FfmpegExportStates } from '../states/Exports'
import { ExportsState } from '../types/ExportsState'
import dataMapFn from '../lib/dataMapFn'
import indexMapFn, { PreservedIndex } from '../lib/indexMapFn'
import renderFfmpegFrame from '../lib/renderFfmpegFrame'
import getGenerateProgress from '../lib/getGenerateProgress'

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
          ffmpeg,
          completedFrames,
          frames,
          progressPromise,
          fps
        } = data
        const { FS, run } = ffmpeg

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
            FS('writeFile', `${i}-${completedFrames + 1}.png`, buffer)
            const doneRendering = completedFrames + 1 === frames.length
            setExports(new Set([
              ...exportsArr.slice(0, i),
              {
                type: ExportTypes.FFMPEG,
                data: {
                  ...data,
                  ...doneRendering
                    ? {
                      state: FfmpegExportStates.GENERATING_VIDEO,
                      canvas: undefined,
                      renderPromise: undefined,
                      progressPromise: getGenerateProgress(ffmpeg)
                    }
                    : renderFfmpegFrame(data),
                  completedFrames: completedFrames + 1
                }
              },
              ...exportsArr.slice(i + 1)
            ]))
            if (doneRendering) {
              run('-r', fps.toString(), '-i', `${i}-%01d.png`, '-an', '-vcodec', 'libx264', '-pix_fmt', 'yuv420p', `${i}.mp4`).catch(() => {
                alert('Error generating video')
              })
            }
          })
          .catch((e) => {
            console.log(e)
            alert('Error creating PNG blob')
          })

        progressPromise
          ?.then(generateProgress => {
            if (canceled) return
            setExports(new Set([
              ...exportsArr.slice(0, i),
              {
                type: ExportTypes.FFMPEG,
                data: {
                  ...data,
                  generateProgress,
                  ...generateProgress === 1
                    ? {
                      state: FfmpegExportStates.COMPLETE,
                      url: URL.createObjectURL(new Blob([FS('readFile', `${i}.mp4`)], { type: 'video/mp4' })),
                      progressPromise: undefined
                    }
                    : {
                      progressPromise: getGenerateProgress(ffmpeg)
                    }
                }
              },
              ...exportsArr.slice(i + 1)
            ]))
          })
          .catch(() => {
            alert('Error getting progress')
          })
      })

    return () => {
      canceled = true
    }
  }, [exportsArr, exportsArrFfmpeg, setExports])
}

export default useExportsFfmpeg
