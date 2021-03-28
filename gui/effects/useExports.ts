import { useState } from 'react'
import { Exports } from '../states/Exports'
import { ExportsState } from '../types/ExportsState'
import useExportsFfmpeg from './useExportsFfmpeg'
import useExportsRecorder from './useExportsRecorder'

const useExports = (): ExportsState => {
  const exportsState = useState<Exports>(new Set())

  useExportsRecorder(exportsState)
  useExportsFfmpeg(exportsState)

  return exportsState
}

export default useExports
