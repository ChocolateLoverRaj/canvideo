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

//Easily force types in functions, as well as overload functions
class Overloader {
    constructor() {
        this.overloads = [];
        this.function = function () {

        };
    }

    overload(){
        
    }
}

var stonk = new Overloader();

console.log(stonk)

//Export the module
module.exports = {
    Types,
    interface,
    Interface,
    arrayOf
};