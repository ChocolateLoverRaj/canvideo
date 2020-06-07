//File that imports and exports all type features
//Easily access all features in ./type folder.

//Dependencies
const Types = require("./type/types");
const { interface, Interface } = require("./type/interface");
const arrayOf = require("./type/array-of");
const keyValueObject = require("./type/key-value-object");
const Overloader = require("./type/overloader");
const typedFunction = require("./type/typed-function");
const either = require("./type/either");
const instanceOf = require("./type/instanceOf");

//Export the module
module.exports = {
    Types,
    interface,
    Interface,
    arrayOf,
    keyValueObject,
    Overloader,
    typedFunction,
    either,
    instanceOf
};