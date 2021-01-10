import nextToPromise from './next-to-promise'
import { Handler } from 'express'

interface AcceptObj {
  mp4: (...handlers: Handler[]) => Accept
  json: (...handlers: Handler[]) => Accept
}

type Accept = Handler & AcceptObj

enum Types {
  mp4 = 'video/mp4',
  json = 'application/json'
}
interface Matcher {
  type: Types
  handler: Handler
}

interface AllOptions {
  send415: boolean
}

const defaultOptions: AllOptions = {
  send415: true
}

const accept = (givenOptions: Partial<AllOptions> = {}): Accept => {
  // Defaultify the options
  const options: AllOptions = {
    ...givenOptions,
    ...defaultOptions
  }
  const matchers: Matcher[] = []
  const accept: Accept = Object.assign<Handler, AcceptObj>(async (req, res, next) => {
    // TODO: Match asterisk content types, as well as follow the order of preferred content types.
    const accept = req.headers.accept?.split(',').map(contentType => contentType.trim()) ?? []
    for await (const { type, handler } of matchers) {
      if (accept.includes(type)) {
        const { next, promise } = nextToPromise()
        handler(req, res, next)
        await promise
      }
    }
    if (options.send415) {
      res.sendStatus(415)
    } else {
      next()
    }
  }, {
    mp4: (...handlers) => {
      matchers.push(...handlers.map(handler => ({
        type: Types.mp4,
        handler: handler
      })))
      return accept
    },
    json: (...handlers) => {
      matchers.push(...handlers.map(handler => ({
        type: Types.json,
        handler: handler
      })))
      return accept
    }
  })
  return accept
}

export default accept
