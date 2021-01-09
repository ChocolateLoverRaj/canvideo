// Validate middle-ware for express
import { RequestHandler } from 'express'
import { validate } from 'jsonschema'

export default (schema: any): RequestHandler => async (req, res, next) => {
  const result = validate(req.body, await schema)
  if (!result.valid) {
    res.status(400).json(result.errors)
    return
  }
  next()
}
