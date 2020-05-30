//File for types.
//My concept of types are function that check the type of anything.
//They return a string error, which is false if there is no error.

//Types Enum.
const Types = {
    ANY: a => false,

    NUMBER: a => typeof a === 'number' ? false : "is not a number.",
    NON_NEGATIVE_NUMBER: a => typeof a === 'number' && a >= 0 ? false : "is not a non negative number.",
    INTEGER: a => Number.isSafeInteger(a) ? false : "is not a safe integer.",
    NON_NEGATIVE_INTEGER: a => Number.isSafeInteger(a) && a >= 0 ? false : "is not a non negative integer.",

    STRING: a => typeof a === 'string' ? false : "is not a string.",

    BOOLEAN: a => typeof a === 'boolean' ? false : "is not a boolean.",
    TRUTHY: a => a ? false : "is not truthy.",
    FALSY: a => a ? "is not falsy." : false,

    FUNCTION: a => typeof a === 'function' ? false : "is not a function.",
    SETTER: a => typeof a === 'function' ? false : "is not a valid setter.",
    GETTER: a => typeof a === 'function' ? false : "is not a valid getter.",

    OBJECT: a => typeof a === 'object' ? false : "is not an object.",
    ARRAY: a => Array.isArray(a) ? false : "is not an Array.",

    KEY: a => ['symbol', 'string', 'number'].includes(typeof a) ? false : "is not a valid key type (symbol, string, or number).",

    TYPE: a => typeof a === 'function' ? false : "is not a type function."
};

//Export the module.
module.exports = Types;