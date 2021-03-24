import { createContext } from 'react'
import { ExportsState } from '../effects/useExports'

export interface GlobalContextValue {
  exports: ExportsState
}

const GlobalContext = createContext<GlobalContextValue>(undefined as any)

export default GlobalContext
