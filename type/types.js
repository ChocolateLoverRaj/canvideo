//File for types.
//My concept of types are function that check the type of anything.
//They return a string error, which is false if there is no error.

//Dependencies
const tinyColor = require('tinycolor2');

//Types Enum.
const Types = {
    ANY: a => false,

    NUMBER: a => typeof a === 'number' ? false : "is not a number.",
    POSITIVE_NUMBER: a => typeof a === 'number' && a > 0 ? false : "is not a positive number.",
    NON_NEGATIVE_NUMBER: a => typeof a === 'number' && a >= 0 ? false : "is not a non negative number.",
    INTEGER: a => Number.isSafeInteger(a) ? false : "is not a safe integer.",
    POSITIVE_INTEGER: a => Number.isSafeInteger(a) && a > 0 ? false : "is not a positive integer",
    NON_NEGATIVE_INTEGER: a => Number.isSafeInteger(a) && a >= 0 ? false : "is not a non negative integer.",
    UNIT_INTERVAL: a => typeof a === 'number' && a >= 0 && a <= 1 ? false : "is not a unit interval (number between 0 and 1)",
    RGB_INTENSITY: a => typeof a === 'number' && a >= 0 && a <= 255 ? false : "is not a valid rgb intensity (number between 0 and 255)",

    STRING: a => typeof a === 'string' ? false : "is not a string.",
    COLOR: a => new tinyColor(a).isValid() ? false : "is not a valid color string representation",

    BOOLEAN: a => typeof a === 'boolean' ? false : "is not a boolean.",
    TRUTHY: a => a ? false : "is not truthy.",
    FALSY: a => a ? "is not falsy." : false,

    FUNCTION: a => typeof a === 'function' ? false : "is not a function.",

    OBJECT: a => typeof a === 'object' ? false : "is not an object.",
    ARRAY: a => Array.isArray(a) ? false : "is not an Array.",

    KEY: a => ['symbol', 'string', 'number'].includes(typeof a) ? false : "is not a valid key type (symbol, string, or number).",

    TYPE: a => typeof a === 'function' ? false : "is not a type function."
};

//Export the module.
module.exports = Types;