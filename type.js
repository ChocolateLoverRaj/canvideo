//File that exports and exports all type features
//Easily access all features in ./type folder.

//Export everything
export {
    ANY,

    NUMBER,
    POSITIVE_NUMBER,
    NON_NEGATIVE_NUMBER,
    INTEGER,
    POSITIVE_INTEGER,
    NON_NEGATIVE_INTEGER,
    UNIT_INTERVAL,
    RGB_INTENSITY,

    STRING,
    COLOR,

    BOOLEAN,
    TRUTHY,
    FALSY,

    FUNCTION,

    OBJECT,
    ARRAY,

    KEY,

    TYPE,
} from "./type/types";
export { interface, Interface } from "./type/interface";
export { default as arrayOf } from "./type/array-of";
export { default as keyValueObject } from "./type/key-value-object";
export { default as Overloader } from "./type/overloader";
export { default as typedFunction } from "./type/typed-function";
export { default as either } from "./type/either";
export { default as instanceOf } from "./type/instanceOf";