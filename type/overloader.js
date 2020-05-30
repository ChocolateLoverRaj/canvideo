//File for creating function overloads in an easy way.
//Just give the list of args, which includes the type and whether they are optional or not.

//Dependancies
const Types = require("./types");
const { Interface } = require("./interface");

//The type for a special parameter.
const paramType = new Interface(false)
    .required("type", Types.TYPE)
    .optional("optional", Types.BOOLEAN)
    .toType();

//An array of parameters.
const paramsType = arrayOf(paramType);

//The Overloader class which is used to create overloads.
class Overloader {
    constructor() {
        this.overloads = [];
    }

    overloader() {
        //Go through all the possible overloads
        //We can quickly figure out what overloads won't work based on the minLength and maxLength
        var possibleOverloads = [];
        if (this.overloads.length === 0) {
            throw new TypeError("Cannot call an overloader with 0 overloads.");
        }
        for (var i = 0; i < this.overloads.length; i++) {
            let overload = this.overloads[i];
            if (arguments.length >= overload.minLength && arguments.length <= overload.maxLength) {
                possibleOverloads.push(overload);
            }
        }
        for (var i = 0; i < arguments.length; i++) {
            let arg = arguments[i];
            for (var j = 0; j < possibleOverloads.length; j++) {
                let argType = possibleOverloads[j].args[i].type;
                if (argType(arg)) {
                    //Eliminate this as a possible overload
                    possibleOverloads.splice(j, 1);
                }
            }
        }
        //If there are 1 possible overloads, that's great
        if (possibleOverloads.length === 1) {
            possibleOverloads[0].f.apply(this.boundTo, arguments);
        }
        //If there are 0 possible overloads, it's the caller's fault
        else if (possibleOverloads.length === 0) {
            throw new TypeError("Invalid arguments.");
        }
        //If there are more than two, then the overloader has conflicted overloads
        else {
            throw new TypeError("Bad overloader. Overloads have conflicts.");
        }
    }
    overload(args, f) {
        let err = paramsType(args);
        if (!err) {
            let err = Types.FUNCTION(f);
            if (!err) {
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
                        throw new TypeError("Arguements are invalid because required parameters cannot come after an optional parameter.");
                    }
                }
                if (!optionalsStarted) {
                    minLength = args.length;
                }
                //Make sure that ther arguements are different types
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
                            throw new TypeError("Arguements are invalid because they conflict with another overload.");
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
            }
            else {
                throw new TypeError(`f: ${f}, ${err}`);
            }
        }
        else {
            throw new TypeError(`arguements: ${arguments}, ${err}`);
        }
        return this;
    }
    bind(a) {
        this.boundTo = a;
        return this;
    }
}

//Export the module
module.exports = Overloader;