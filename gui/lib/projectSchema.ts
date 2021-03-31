import { JSONSchema7 } from 'json-schema'
import sizeSchema from './sizeSchema'
import operationsSchema from 'canvideo/dist/operations.schema.json'

const projectSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    width: sizeSchema,
    height: sizeSchema,
    duration: {
      type: 'number',
      exclusiveMinimum: 0
    },
    frames: {
      type: 'array',
      items: operationsSchema as JSONSchema7
    }
  },
  required: ['width', 'height', 'duration', 'frames']
}

export default projectSchema
