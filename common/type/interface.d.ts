import type from "./type";

interface Keys {
    [key: string]: Value;
}
interface Value {
    type: type;
    required?: boolean;
}

export function interfaceToType(o: Keys, extendible?: boolean): type;

export class Interface {
    constructor(extendible?: boolean);

    key(key: string, type: type, required?: boolean): this;
    required(key: string, type: type): this;
    optional(key: string, type: type): this;
    toType(): type;
}