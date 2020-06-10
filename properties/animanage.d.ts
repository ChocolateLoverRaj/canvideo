import type = require("../type/type");
import params = require("./animanage/params");
import Animanaged = require("./animanage/animanaged");

const propertiesType: type;
const methodsToBindType: type;

declare function animanage<T extends Object>(o: T, properties: params.Properties, methodsToBind: params.methods): Animanaged<T>;

export = { propertiesType, methodsToBindType, animanage };