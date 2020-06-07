import type from "../type/type";

declare interface Property {
    type?: type;
    setter?: (v?: any, set?: (v: any) => void) => void;
    getter?: () => any;
    initial?: any;
}
declare type property = type | Property;

export = property;