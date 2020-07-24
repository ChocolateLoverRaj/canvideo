import type from "../type/type";

export interface Property {
    type?: type;
    setter?: (v?: any, set?: (v: any) => void) => void;
    getter?: () => any;
    initial?: any;
}
export type property = type | Property;

export type properties = {
    [Key in string | number ]: property;
}

export type methods = Array<string>;

export default Property;