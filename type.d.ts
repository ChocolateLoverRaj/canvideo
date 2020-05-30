import Types = require("./type/types");
import interface = require("./type/interface");
import arrayOf = require("./type/array-of");
import keyValueObject = require("./type/key-value-object");
import Overloader = require("./type/overloader");
import typedFunction = require("./type/typed-function");

export = {
    Types,
    interface: interface.interface,
    Interface: interface.Interface,
    arrayOf,
    keyValueObject,
    Overloader,
    typedFunction
}