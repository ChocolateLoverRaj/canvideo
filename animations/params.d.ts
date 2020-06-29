import property = require("../properties/property");

export interface Properties {
    [key: string | number]: property;
}
export type methods = Array<string>;