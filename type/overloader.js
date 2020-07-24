//File for creating function overloads in an easy way.
//Just give the list of args, which includes the type and whether they are optional or not.

//Dependencies
import { TYPE, BOOLEAN, FUNCTION } from "./types";
import { Interface } from "./interface";
import arrayOf from "./array-of";
import typedFunction from "./typed-function";

//The type for a special parameter.
const paramType = new Interface(false)
    .required("type", TYPE)
    .optional("optional", BOOLEAN)
    .toType();

//An array of parameters.
const paramsType = arrayOf(paramType);

//The Overloader class which is used to create overloads.
export default class Overloader {
    constructor() {
        this.overloads = [];
    }

    get overloader() {
        var overloads = this.overloads;
        return function (...args) {
            var possibleOverloads = overloads.filter(function (overload) {
                if (args.length >= overload.minLength && args.length <= overload.maxLength) {
                    for (var i = 0; i < args.length; i++) {
                        let arg = overload.args[i];
                        if (arg.type(args[i])) {
                            return false;
                        }
                    }
                    return true;
                }
                else {
                    return false;
                }
            });

            //If there are 1 possible overloads, that's great
            if (possibleOverloads.length === 1) {
                return possibleOverloads[0].f.apply(this, arguments);
            }
            //If there are 0 possible overloads, it's the caller's fault
            else if (possibleOverloads.length === 0) {
                throw new TypeError("Invalid arguments.");
            }
            //If there are more than two, then the overloader has conflicted overloads
            else {
                throw new TypeError("Bad overloader. Overloads have conflicts.");
            }
        };
    }
    overload() {
        return typedFunction([{ name: "args", type: paramsType }, { name: "f", type: FUNCTION }], function (args, f) {
            //Calculate the minimum length
            var optionalsStarted = false, minLength;
            for (var i = 0; i < args.length; i++) {
                let arg = args[i];
                if (arg.optional) {
                    if (!optionalsStarted) {
                        optionalsStarted = true, minLength = i;
                    }
                }
                else if (optionalsStarted) {
                    throw new TypeError("Arguments are invalid because required parameters cannot come after an optional parameter.");
                }
            }
            if (!optionalsStarted) {
                minLength = args.length;
            }
            //Make sure that their arguments are different types
            for (var i = 0; i < this.overloads.length; i++) {
                let overload = this.overloads[i];
                //No problem unless they have the same minLength
                let noWayConflicts = [
                    args.length < overload.minLength,
                    args.minLength > overload.length
                ];
                if (!noWayConflicts.includes(true)) {
                    var exactSame = true;
                    for (var j = 0; j < minLength; j++) {
                        let existingArg = overload.args[j];
                        let arg = args[j];
                        //If they are the same type, keep searching making sure that all their types aren't the same
                        //Otherwise, stop searching
                        if (arg.type !== existingArg.type) {
                            exactSame = false;
                            break;
                        }
                    }
                    if (exactSame) {
                        throw new TypeError("Arguments are invalid because they conflict with another overload.");
                    }
                }
            }

            //Add the overload
            this.overloads.push({
                minLength: minLength,
                maxLength: args.length,
                args: args,
                f: f
            });
            return this;
        }).apply(this, arguments);
    };
}