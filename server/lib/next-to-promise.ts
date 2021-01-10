// Promisifies the express 'next' function
import { NextFunction } from 'express'
import never from 'never'

type CbPromise = Promise<'router' | undefined>

interface NextPromise {
  next: NextFunction
  promise: CbPromise
}

const nextToPromise = (): NextPromise => {
  let next: NextFunction = never
  const promise: CbPromise = new Promise((resolve, reject) => {
    next = (v: 'router' | any) => {
      if (v === 'router' || v === undefined) {
        resolve(v)
      } else {
        reject(v)
      }
    }
  })
  return { next, promise }
}

export default nextToPromise
