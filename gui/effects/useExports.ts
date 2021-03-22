import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Exports } from '../states/Exports'

export type ExportsState = [Exports, Dispatch<SetStateAction<Exports>>]

const useExports = (): ExportsState => {
  const exportsState = useState<Exports>(new Set())

  useEffect(() => {
    console.log('using exports')
  }, [])

  return exportsState
}

export default useExports
