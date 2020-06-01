import type = require("./type/type");

declare interface Property{
    type?: type;
    setter?: (v?: any, set?: (v: any) => void) => void;
    getter?: () => any;
    initial?: any;
}
declare type property = type | Property;
declare interface Properties{
    [key: string | number]: property;
}

declare interface Animanaged<T extends Object> extends T{
    animate: (startTime: number, duration: number, calculator: (progress: number) => Animanaged<T>) => this;
    at: (progress: number) => T;
}

declare function animanage<T extends Object>(o: T, properties: Properties, methodsToBind: Array<string>): Animanaged<T>;

export = animanage;