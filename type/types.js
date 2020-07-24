//File for types.
//My concept of types are function that check the type of anything.
//They return a string error; which is false if there is no error.

//Dependencies
import tinyColor from 'tinycolor2';

//Anything
export const ANY = a => false;

//Numbers
export const NUMBER = a => typeof a === 'number' ? false : "is not a number.";
export const POSITIVE_NUMBER = a => typeof a === 'number' && a > 0 ? false : "is not a positive number.";
export const NON_NEGATIVE_NUMBER = a => typeof a === 'number' && a >= 0 ? false : "is not a non negative number.";
export const INTEGER = a => Number.isSafeInteger(a) ? false : "is not a safe integer.";
export const POSITIVE_INTEGER = a => Number.isSafeInteger(a) && a > 0 ? false : "is not a positive integer";
export const NON_NEGATIVE_INTEGER = a => Number.isSafeInteger(a) && a >= 0 ? false : "is not a non negative integer.";
export const UNIT_INTERVAL = a => typeof a === 'number' && a >= 0 && a <= 1 ? false : "is not a unit interval (number between 0 and 1)";
export const RGB_INTENSITY = a => typeof a === 'number' && a >= 0 && a <= 255 ? false : "is not a valid rgb intensity (number between 0 and 255)";

//Strings
export const STRING = a => typeof a === 'string' ? false : "is not a string.";
export const COLOR = a => new tinyColor(a).isValid() ? false : "is not a valid color string representation";

//Booleans
export const BOOLEAN = a => typeof a === 'boolean' ? false : "is not a boolean.";
export const TRUTHY = a => a ? false : "is not truthy.";
export const FALSY = a => a ? "is not falsy." : false;

//Function
export const FUNCTION = a => typeof a === 'function' ? false : "is not a function.";

//Object
export const OBJECT = a => typeof a === 'object' ? false : "is not an object.";
export const ARRAY = a => Array.isArray(a) ? false : "is not an Array.";

//Object key
export const KEY = a => ['symbol', 'string', 'number'].includes(typeof a) ? false : "is not a valid key type (symbol, string, or number).";

//Type function
export const TYPE = a => typeof a === 'function' ? false : "is not a type function.";