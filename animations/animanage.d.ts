import type from "../type/type";
import Animanaged from "./animanaged";
import { Property as TypifyProperty, methods } from "../properties/properties";

declare type toJson = ((stringify?: true, fps?: number) => string) | ((stringify: false, fps?: number) => any);

declare interface Property extends TypifyProperty{
    toJson?: toJson;
}

declare type property = type | Property;

declare interface Properties {
    [string | number]: property;
}

export declare const propertiesType: type;
export declare const methodsToBindType: type;

export declare function animanage<T extends object, P extends object>(o: T, properties: Properties, methodsToBind: methods): T & Animanaged<T, P>;