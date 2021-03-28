export type PreservedIndex<T> = [T, number]

// Useful for wanting the original index of array elements when (forEach)ing them
const indexMapFn = <T>(v: T, i: number): PreservedIndex<T> => [v, i]

export default indexMapFn
