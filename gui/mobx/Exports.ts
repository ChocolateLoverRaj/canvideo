import { makeObservable, observable } from 'mobx'
import ExportObj from './ExportObj'

class Exports {
  exports: ExportObj[] = []

  constructor () {
    makeObservable(this, {
      exports: observable
    })
  }
}

export default Exports
