import { JSONSchema7 } from 'json-schema'

const sizeSchema: JSONSchema7 = {
  type: 'number',
  multipleOf: 2,
  exclusiveMinimum: 0
}

export default sizeSchema
