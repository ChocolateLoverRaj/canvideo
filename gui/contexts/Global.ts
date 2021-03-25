import { createContext } from 'react'
import { ExportsState } from '../types/ExportsState'

export interface GlobalContextValue {
  exports: ExportsState
}

const GlobalContext = createContext<GlobalContextValue>(undefined as any)

export default GlobalContext
