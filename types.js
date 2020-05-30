//Quick way of finding type errors

//Types functions return false if good and a string error if not good
const Types = {
    ANY: a => false,

    NUMBER: a => typeof a === 'number' ? false : "is not a number.",
    NON_NEGATIVE_NUMBER: a => typeof a === 'number' && a >= 0 ? false : "is not a non negative number.",
    INTEGER: a => Number.isSafeInteger(a) ? false : "is not a safe integer.",
    NON_NEGATIVE_INTEGER: a => Number.isSafeInteger(a) && a >= 0 ? false : "is not a non negative integer.",

    STRING: a => typeof a === 'string' ? false : "is not a string.",

    BOOLEAN: a => typeof a === 'boolean' ? false : "is not a boolean.",
    TRUTHY: a => a ? false : "is not truthy.",
    FALSY: a => a ? "is not falsy." : false,

    FUNCTION: a => typeof a === 'function' ? false : "is not a function.",

    OBJECT: a => typeof a === 'object' ? false : "is not an object.",
    ARRAY: a => Array.isArray(a) ? false : "is not an Array.",

    KEY: a => ['symbol', 'string', 'number'].includes(typeof a) ? false : "is not a valid key type (symbol, string, or number).",

    TYPE: a => typeof a === 'function' && a.length === 1 ? false : "is not a type function."
};

//Map to interface
function returnInterface(keys, extendible) {
    return a => {
        var err = Types.OBJECT(a);
        if (!err) {
            for (let [k, { type, required }] of keys.entries()) {
                if (a.hasOwnProperty(k)) {
                    let v = a[k];
                    let err = type(v);
                    if (err) {
                        return `invalid type for property: ${k}, ${v} ${err}`;
                    }
                }
                else if (required) {
                    return `property: ${k}, is required but not present.`;
                }
            }
            if (!extendible) {
                let aKeys = Object.keys(a);
                for (var i = 0; i < aKeys.length; i++) {
                    let k = aKeys[i];
                    if (!keys.has(k)) {
                        return `extra property: ${k} is not allowed.`;
                    }
                }
            }
            return false;
        }
        else {
            return `${err}`;
        }
    };
}

//Interface function
function interface(o, extendible = true) {
    let err = Types.OBJECT(o);
    if (!err) {
        let err = Types.BOOLEAN(extendible);
        if (!err) {
            let keys = new Map();
            for (let k in o) {
                let v = o[k];
                let { type, required } = v;
                for (let k in v) {
                    if (!["type", "required"].includes(k)) {
                        throw new TypeError(`extra key: ${k}, is not allowed.`);
                    }
                }
                if (typeof required === 'undefined') {
                    required = false;
                }
                else {
                    let err = Types.BOOLEAN(required);
                    if (err) {
                        throw new TypeError(`required: ${required}, ${err}`);
                    }
                }
                let err = Types.TYPE(type);
                if (!err) {
                    keys.set(k, { type, required });
                }
                else {
                    throw new TypeError(`type: ${type}, ${err}`);
                }
            }
            return returnInterface(keys, extendible);
        }
        else {
            throw new TypeError(`extendible: ${extendible}, ${err}`);
        }
    }
    else {
        throw new TypeError(`o: ${o} ${err}`);
    }
};

//Interface class
class Interface {
    constructor(extendible = true) {
        let err = Types.BOOLEAN(extendible);
        if (!err) {
            this.extendible = extendible;
            this.keys = new Map();
        }
        else {
            throw new TypeError(`extendible: ${extendible}, ${err}`);
        }
    }
    key(key, type, required = true) {
        let err = Types.STRING(key);
        if (!err) {
            let err = Types.TYPE(type);
            if (!err) {
                let err = Types.BOOLEAN(required);
                if (!err) {
                    this.keys.set(key, {
                        type: type,
                        required: required
                    });
                }
                else {
                    throw new TypeError(`required: ${required}, ${err}`);
                }
            }
            else {
                throw new TypeError(`type: ${type}, ${err}`);
            }
        }
        else {
            throw new TypeError(`key: ${key}, ${err}`);
        }
        return this;
    }
    required(key, type) {
        return this.key(key, type, true);
    }
    optional(key, type) {
        return this.key(key, type, false);
    }
    toType() {
        return returnInterface(this.keys, this.extendible);
    }
}

//Array of a certain type
function arrayOf(type) {
    let err = Types.TYPE(type);
    if (!err) {
        return a => {
            let err = Types.ARRAY(a);
            if (!err) {
                for (let i = 0; i < a.length; i++) {
                    let v = a[i];
                    let err = type(v);
                    if (err) {
                        return `is not a valid array of: ${type}, because ${v}, the ${i}th element, ${err}`;
                    }
                }
                return false;
            }
            else {
                return `array: ${a}, ${err}`;
            }
        }
    }
    else {
        throw new TypeError(`type: ${type}, ${err}`);
    }
}

//Key value object
function keyValueObject(valueType) {
    let err = Types.TYPE(valueType);
    if (!err) {
        return a => {
            let err = Types.OBJECT(a);
            if (!err) {
                for (let k in a) {
                    let v = a[k];
                    let err = valueType(v);
                    if (err) {
                        return `object: ${a} is invalid. key: ${k}, does fit type: ${valueType}, because ${v} ${err}`;
                    }
                }
                return false;
            }
            else {
                return `object: ${a}, ${err}`;
            }
        }
    }
    else {
        throw new TypeError(`valueType: ${valueType}, ${err}`);
    }
}

//Easily force types in functions, as well as overload functions
const paramType = new Interface(false)
    .required("type", Types.TYPE)
    .optional("optional", Types.BOOLEAN)
    .toType();
const paramsType = arrayOf(paramType);
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
            console.log(this.boundTo instanceof Strict)
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
    bind(a){
        this.boundTo = a;
        return this;
    }
    getOverloader() {
        return this.overloader;
    }
}

var stonk = new Overloader()
    .overload([{ type: Types.STRING }], s => {
        this.r = "you give me a string: " + s;
        console.log(this)
    })
    .overload([{ type: Types.NUMBER }], function(n) {
        this.r = "you give me a number: " + n;
    });

class Strict{
    constructor(){
        stonk.bind(this).overloader(...arguments);
    }
}

var s = new Strict(1);

console.log(s)

//Export the module
module.exports = {
    Types,
    interface,
    Interface,
    arrayOf
};