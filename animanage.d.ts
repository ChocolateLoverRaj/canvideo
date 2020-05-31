import type = require("./type/type");

declare interface Property{
    type?: type;
    setter?: Function;
    getter?: Function;
}
declare type property = type | Property;
declare interface Properties{
    [key: string | number]: property;
}

declare interface Animanaged<T extends Object> extends T{
    animate: (startTime: number, duration: number, calculator: number) => Animanaged<T>;
    at: (progress: number) => T;
}

declare function animanage<T extends Object>(o: T, properties: Properties, methodsToBind: Array<string>): Animanaged<T>;

export = animanage;