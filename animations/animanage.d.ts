import type from "../type/type";
import Animanaged from "./animanaged";
import { Property as TypifyProperty, methods } from "../properties/properties";

type toJson = ((stringify?: true, fps?: number) => string) | ((stringify: false, fps?: number) => any);

interface Property extends TypifyProperty{
    toJson?: toJson;
}

type property = type | Property;

interface Properties {
    [string | number]: property;
}

export declare const propertiesType: type;

export declare function animanage<T extends object, P extends object>(o: T, properties: Properties, methodsToBind: methods): T & Animanaged<T, P>;