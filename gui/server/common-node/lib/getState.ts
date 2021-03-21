// Get the state of a promise
export enum PromiseStates {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}
export interface StateObj<T> {
  promise: Promise<T>
  state: PromiseStates
  value?: T
}
const getState = <T>(promise: Promise<T>): StateObj<T> => {
  const stateObj: StateObj<T> = {
    promise: promise,
    state: PromiseStates.PENDING
  }
  promise
    .then(v => {
      stateObj.state = PromiseStates.RESOLVED
      stateObj.value = v
    })
    .catch(() => {
      stateObj.state = PromiseStates.REJECTED
    })
  return stateObj
}

export default getState
