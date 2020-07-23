import type from "./type";

declare namespace Types {
    const ANY: type;

    const NUMBER: type;
    const POSITIVE_NUMBER: type;
    const NON_NEGATIVE_NUMBER: type;
    const INTEGER: type;
    const POSITIVE_INTEGER: type;
    const NON_NEGATIVE_INTEGER: type;
    const UNIT_INTERVAL: type;
    const RGB_INTENSITY: type;

    const STRING: type;
    const COLOR: type;

    const BOOLEAN: type;
    const TRUTHY: type;
    const FALSY: type;

    const FUNCTION: type;

    const OBJECT: type;
    const ARRAY: type;

    const KEY: type;

    const TYPE: type;
}

export = Types;