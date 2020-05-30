//File that imports and exports all type features
//Easily access all features in ./type folder.

//Dependencies
const Types = require("./type/types");
const {interface, Interface} = require("./type/interface");
const arrayOf = require("./type/array-of");
const keyValueObject = require("./type/key-value-object");
const Overloader = require("./type/overloader");

//Export the module
module.exports = {
    Types,
    interface,
    Interface,
    arrayOf,
    keyValueObject,
    Overloader
};