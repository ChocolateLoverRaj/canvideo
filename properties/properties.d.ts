import type from "../type/type";

export declare interface Property {
    type?: type;
    setter?: (v?: any, set?: (v: any) => void) => void;
    getter?: () => any;
    initial?: any;
}
export declare type property = type | Property;

export declare type properties = {
    [Key in string | number ]: property;
}

export declare type methods = Array<string>;

export default Property;