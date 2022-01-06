import moduleToWorker from './moduleToWorker'
import { decode } from 'post-any-message'

const importFromWorker = async (moduleCode: string): Promise<any> => await new Promise<any>((resolve, reject) => {
  const workerCode = moduleToWorker(moduleCode)
  const url = URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' }))
  const worker = new Worker(url, { type: 'module' })
  worker.onerror = reject
  worker.onmessageerror = reject
  worker.onmessage = e => {
    resolve(decode(e.data))
  }
})

export default importFromWorker
