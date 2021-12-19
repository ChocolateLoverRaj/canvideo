import { computed, makeObservable } from 'mobx'
import { LocalStorage } from 'mobx-localstorage'
import ExportTypes from '../types/ExportTypes'

const localStorageKey = 'defaultMethod'
const defaultMethod = ExportTypes.WEBM_WRITER

class DefaultMethod {
  readonly localStorage = new LocalStorage()

  get defaultMethod (): ExportTypes {
    return (typeof localStorage !== 'undefined'
      ? this.localStorage.getItem(localStorageKey)
      : undefined) ?? defaultMethod
  }

  set defaultMethod (method) {
    this.localStorage.setItem(localStorageKey, method)
  }

  constructor () {
    makeObservable(this, {
      defaultMethod: computed
    })
  }
}

export default DefaultMethod
