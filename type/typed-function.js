//File to create typed functions.
//Typed functions throw TypeErrors by themselves.

//Dependencies
import { TYPE, STRING, BOOLEAN, ANY, FUNCTION } from "./types.js";
import { Interface } from "./interface.js";
import arrayOf from "./array-of.js";

//Argument interface
const argType = new Interface(false)
    .required("type", TYPE)
    .required("name", STRING)
    .optional("optional", BOOLEAN)
    .optional("default", ANY)
    .toType();

//Array of arguments
const argsType = arrayOf(argType);

//Typed function
const typedFunction = (args, f) => {
    let err = argsType(args);
    if (!err) {
        //Required parameters cannot come after optional parameters.
        var optionalsStarted = false;
        var minLength = 0;
        for (var i = 0; i < args.length; i++) {
            let arg = args[i];
            if (arg.optional) {
                optionalsStarted = true;
            }
            else if (optionalsStarted) {
                throw new TypeError("Invalid args - required parameters cannot come after optional parameters.");
            }
            else {
                minLength++;
            }
        }
        let err = FUNCTION(f);
        if (!err) {
            return function () {
                const lengthRange = `${minLength} - ${args.length}`;
                if (arguments.length < minLength || arguments.length > args.length) {
                    throw new TypeError(`Expected ${lengthRange} arguments, but got ${arguments.length}.`);
                }
                var processedArgs = [];
                for (var i = 0; i < arguments.length; i++) {
                    let givenArg = arguments[i];
                    let arg = args[i];
                    if (typeof givenArg === 'undefined') {
                        if (arg.optional || arg.default) {
                            processedArgs.push(arg.default);
                        }
                        else {
                            throw new TypeError(`Missing required argument: ${arg.name}.`);
                        }
                    }
                    else {
                        let err = arg.type(givenArg);
                        if (!err) {
                            processedArgs.push(givenArg);
                        }
                        else {
                            throw new TypeError(`${arg.name}: ${givenArg}, ${err}`);
                        }
                    }
                }
                return f.apply(this, processedArgs);
            }
        }
        else {
            throw new TypeError(`f: ${f}, ${err}`);
        }
    }
    else {
        throw new TypeError(`args: ${args}, ${err}`);
    }
};

export default typedFunction;