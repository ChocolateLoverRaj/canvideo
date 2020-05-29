declare type type = (a: any) => false | string;

declare abstract class Types {
    static ANY: type;

    static NUMBER: type;
    static NON_NEGATIVE_NUMBER: type;
    static INTEGER: type;
    static NON_NEGATIVE_INTEGER: type;

    static STRING: type;

    static BOOLEAN: type;
    static TRUTHY: type;
    static FALSY: type;

    static FUNCTION: type;

    static OBJECT: type;
    static ARRAY: type;

    static KEY: type;

    static TYPE: type;
}

interface Keys {
    [key: string]: Value;
}
interface Value {
    type: type;
    required?: boolean;
}

declare function interface(o: Keys, extendible?: boolean): type;

declare class Interface {
    constructor(extendible?: boolean);

    key(key: string, type: type, requierd?: boolean): this;
    required(key: string, type: type): this;
    optional(key: string, type: type): this;
    toType(): type;
}

declare function arrayOf(type: type): type;

export = { Types, interface, Interface, arrayOf };