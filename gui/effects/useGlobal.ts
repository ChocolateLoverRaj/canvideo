import { GlobalContextValue } from '../contexts/Global'
import useExports from './useExports'

const useGlobal = (): GlobalContextValue => ({
  exports: useExports()
})

export default useGlobal
