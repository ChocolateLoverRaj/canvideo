import type = require("./type/type");
import params = require("./animanage/params");

const propertiesType: type;
const methodsToBindType: type;

declare interface Animanaged<T extends Object> extends T {
    animate: (startTime: number, duration: number, calculator: (progress: number) => Animanaged<T>) => this;
    at: (progress: number) => T;
}

declare function animanage<T extends Object>(o: T, properties: params.Properties, methodsToBind: params.methods): Animanaged<T>;

export = { propertiesType, methodsToBindType, animanage };