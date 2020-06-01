import type = require("./type");

declare abstract class Types {
    static ANY: type;

    static NUMBER: type;
    static NON_NEGATIVE_NUMBER: type;
    static INTEGER: type;
    static NON_NEGATIVE_INTEGER: type;
    static UNIT_INTERVAL: type;
    static RGB_INTENSITY: type;

    static STRING: type;
    static COLOR: type;

    static BOOLEAN: type;
    static TRUTHY: type;
    static FALSY: type;

    static FUNCTION: type;
    static SETTER: type;
    static GETTER: type;

    static OBJECT: type;
    static ARRAY: type;

    static KEY: type;

    static TYPE: type;
}

export = Types;