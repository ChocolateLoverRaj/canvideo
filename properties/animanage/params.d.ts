import property = require("../property");

export interface Properties {
    [key: string | number]: property;
}
export type methods = Array<string>;