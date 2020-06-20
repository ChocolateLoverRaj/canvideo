import type = require("../type/type");
import Animanaged = require("./animanaged");
import { properties, methods } from "../properties/properties";

export const propertiesType: type;
export const methodsToBindType: type;

export declare function animanage<T extends Object>(o: T, properties: properties, methodsToBind: methods): T & Animanaged<T>;