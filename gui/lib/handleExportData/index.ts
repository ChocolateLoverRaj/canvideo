import { ExportTypes } from '../../types/ExportTypes'
import { Cancel, HandleData } from './types'
import handleWebm from './webm'

type Handlers = {
  [T in ExportTypes]?: HandleData<any>
}

const handlers: Handlers = {
  [ExportTypes.WEBM_WRITER]: handleWebm
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
const handleExportData: HandleData<any> = (data, setData, type): void | Cancel => {
  return handlers[type]?.(data, setData, type)
}

export default handleExportData
