import { createContext } from 'react'
import { ExportsState } from '../effects/useExports'

const ExportsContext = createContext<ExportsState>(undefined as any)

export default ExportsContext
