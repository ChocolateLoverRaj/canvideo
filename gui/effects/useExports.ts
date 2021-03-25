import { useState } from 'react'
import { Exports } from '../states/Exports'
import { ExportsState } from '../types/ExportsState'
import useExportsRecorder from './useExportsRecorder'

const useExports = (): ExportsState => {
  const exportsState = useState<Exports>(new Set())

  useExportsRecorder(exportsState)

  return exportsState
}

export default useExports
