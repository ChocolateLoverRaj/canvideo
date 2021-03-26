interface WithData<T> {
  data: T
}

interface DataMapFn {
  ({ data }: WithData<any>): any
  <T>({ data }: WithData<T>): T
}

const recorderDataMapFn: DataMapFn = ({ data }) => data

export default recorderDataMapFn
