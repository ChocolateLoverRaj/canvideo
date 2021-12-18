import { useEffect, useState } from 'react'
import handleExportData from '../lib/handleExportData'
import { SetData, Cancel } from '../lib/handleExportData/types'
import { Exports } from '../types/ExportTypes'
import { ExportsState } from '../types/ExportsState'
import useExportsFfmpeg from './useExportsFfmpeg'
import useExportsRecorder from './useExportsRecorder'

const useExports = (): ExportsState => {
  const exportsState = useState<Exports>(new Set())

  useExportsRecorder(exportsState)
  useExportsFfmpeg(exportsState)

  const [exports, setExports] = exportsState
  useEffect(() => {
    const exportsArr = [...exports]
    const cancelArr = exportsArr.map<undefined | Cancel>((currentExport, i) => {
      const { type, data } = currentExport
      const setData: SetData<any> = data => {
        setExports(new Set([
          ...exportsArr.slice(0, i),
          {
            ...currentExport,
            data
          },
          ...exportsArr.slice(i + 1)
        ]))
      }
      return handleExportData(data, setData, type) as undefined | Cancel
    })
    return () => {
      cancelArr.forEach(cancel => {
        cancel?.()
      })
    }
  })

  return exportsState
}

export default useExports
