import { ExportTypes } from '../../states/Exports'

export type SetData<T> = (newData: T) => void

export type Cancel = () => void

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type HandleData<T> = (data: T, setData: SetData<T>, type: ExportTypes) => void | Cancel
