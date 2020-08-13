'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var EventEmitter = _interopDefault(require('eventemitter3'));
var tinyColor = _interopDefault(require('tinycolor2'));
var canvas = _interopDefault(require('canvas'));
var fs = require('fs');
var fs__default = _interopDefault(fs);
var path = require('path');
var path__default = _interopDefault(path);
var child_process = require('child_process');
var express = _interopDefault(require('express'));

const once = (emitter, event) => new Promise((resolve, reject) => {
    emitter.once(event, (...args) => {
        resolve(args);
    });
    emitter.once('error', err => {
        reject(err);
    });
});

//Npm Modules

const createCanvas = (width, height) => canvas.createCanvas(width, height);

const Ctx = canvas.CanvasRenderingContext2D;

//File for types.

//Anything
const ANY = a => false;

//Numbers
const NUMBER = a => typeof a === 'number' ? false : "is not a number.";
const POSITIVE_NUMBER = a => typeof a === 'number' && a > 0 ? false : "is not a positive number.";
const NON_NEGATIVE_NUMBER = a => typeof a === 'number' && a >= 0 ? false : "is not a non negative number.";
const INTEGER = a => Number.isSafeInteger(a) ? false : "is not a safe integer.";
const POSITIVE_INTEGER = a => Number.isSafeInteger(a) && a > 0 ? false : "is not a positive integer";
const NON_NEGATIVE_INTEGER = a => Number.isSafeInteger(a) && a >= 0 ? false : "is not a non negative integer.";
const UNIT_INTERVAL = a => typeof a === 'number' && a >= 0 && a <= 1 ? false : "is not a unit interval (number between 0 and 1)";
const RGB_INTENSITY = a => typeof a === 'number' && a >= 0 && a <= 255 ? false : "is not a valid rgb intensity (number between 0 and 255)";

//Strings
const STRING = a => typeof a === 'string' ? false : "is not a string.";
const COLOR = a => new tinyColor(a).isValid() ? false : "is not a valid color string representation";

//Booleans
const BOOLEAN = a => typeof a === 'boolean' ? false : "is not a boolean.";
const TRUTHY = a => a ? false : "is not truthy.";
const FALSY = a => a ? "is not falsy." : false;

//Function
const FUNCTION = a => typeof a === 'function' ? false : "is not a function.";

//Object
const OBJECT = a => typeof a === 'object' ? false : "is not an object.";
const ARRAY = a => Array.isArray(a) ? false : "is not an Array.";
const CANVAS_CTX = a => a instanceof Ctx ? false : "is not CanvasRenderingContext2D.";

//Object key
const KEY = a => ['symbol', 'string', 'number'].includes(typeof a) ? false : "is not a valid key type (symbol, string, or number).";

//Type function
const TYPE = a => typeof a === 'function' ? false : "is not a type function.";

//An object full of all the types
var Types = {
    ANY,
    NUMBER,
    POSITIVE_NUMBER,
    NON_NEGATIVE_NUMBER,
    INTEGER,
    POSITIVE_INTEGER,
    NON_NEGATIVE_INTEGER,
    UNIT_INTERVAL,
    RGB_INTENSITY,
    STRING,
    COLOR,
    BOOLEAN,
    TRUTHY,
    FALSY,
    FUNCTION,
    OBJECT,
    ARRAY,
    CANVAS_CTX,
    KEY,
    TYPE,
};

//File for creating interfaces based on types

//Generate type function from given map
const returnInterface = (keys, extendible) => {
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
};

//Interface function
const interfaceToType = (o, extendible = true) => {
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
                    console.log(o, k, v);
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

//File for creating a special array type.

//Create an array type by giving a type.
const arrayOf = (type, length) => {
    let err = Types.TYPE(type);
    if (!err) {
        let err = Types.NON_NEGATIVE_INTEGER(length);
        if (!err || typeof length === 'undefined') {
            return a => {
                let err = Types.ARRAY(a);
                if (!err) {
                    if (typeof length === 'number' && a.length !== length) {
                        return `does not have length: ${length}.`
                    }
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
            throw new TypeError(`length: ${length}, ${err}`);
        }
    }
    else {
        throw new TypeError(`type: ${type}, ${err}`);
    }
};

//File to create typed functions.

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

//File for creating function overloads in an easy way.

//The type for a special parameter.
const paramType = new Interface(false)
    .required("type", TYPE)
    .optional("optional", BOOLEAN)
    .toType();

//An array of parameters.
const paramsType = arrayOf(paramType);

//The Overloader class which is used to create overloads.
class Overloader {
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

//Check if something is instanceof another

//Capital O in instanceOf
const instanceOf = c => a => a instanceof c ? false : `is not an instance of ${c}.`;

//File that creates either type.

//Fine with either types
const either = (type, ...types) => {
    let err = TYPE(type);
    if (!err) {
        let err = arrayOf(TYPE)(types);
        if (!err) {
            types.unshift(type);
            return a => {
                var errs = [];
                for (var i = 0; i < types.length; i++) {
                    let err = types[i](a);
                    if (!err) {
                        return false;
                    }
                    else {
                        errs.push(err);
                    }
                }
                return errs.join("\nAnd it ");
            };
        }
        else {
            throw new TypeError(`types: ${types}, ${err}`);
        }
    }
    else {
        throw new TypeError(`type: ${type}, ${err}`);
    }
};

//Videos must have a number for width and height

//Size type
const sizeType = a => Number.isSafeInteger(a) && a > 0 && !(a & 1) ? false : "is not a valid size.";

//Interface for video size
const regularSizeInterface = new Interface(false)
    .required("width", sizeType)
    .required("height", sizeType)
    .toType();

//Shortened property names
const shortSizeInterface = new Interface(false)
    .required("w", sizeType)
    .required("h", sizeType)
    .toType();

//Use the regular one or the short one
const sizeInterface = either(regularSizeInterface, shortSizeInterface);

//File for creating a special object type.

//Creates a type based on given valueType.
const keyValueObject = typedFunction([{ name: "valueType", type: Types.TYPE }], function (valueType) {
    return a => {
        if (typeof a === 'object') {
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
            return "is not an object";
        }
    };
});

//Types that are shared between animanage and typify

const propertiesType1 = Types.TYPE;
const propertiesType2 = interfaceToType({
    type: {
        type: Types.TYPE,
        required: false
    },
    setter: {
        type: Types.FUNCTION,
        required: false
    },
    getter: {
        type: Types.FUNCTION,
        required: false
    },
    initial: {
        type: Types.ANY,
        required: false
    }
}, false);
const propertiesType = keyValueObject(either(propertiesType1, propertiesType2));
const methodsToBindType = arrayOf(Types.STRING);

//Typify properties on object

//Properties
const params = [
    {
        name: "o",
        type: Types.OBJECT
    },
    {
        name: "properties",
        type: propertiesType
    }
];

//Typify function
const typify = typedFunction(params, function (o, properties) {
    //Loop through all the properties
    for (const k in properties) {
        if (properties.hasOwnProperty(k)) {
            const p = properties[k];
            const hiddenKey = "_" + k;
            const type = p.type || p;
            if (p.hasOwnProperty("initial")) {
                Object.defineProperty(o, hiddenKey, {
                    configurable: true,
                    enumerable: false,
                    value: p.initial
                });
            }
            const setterAfterFilter = p.setter ?
                p.setter.bind(o) :
                function (v, set) {
                    set(v);
                };
            function set(v) {
                Object.defineProperty(o, hiddenKey, {
                    configurable: true,
                    enumerable: false,
                    value: v
                });
            }
            const setter = type ?
                function (v) {
                    let err = type(v);
                    if (!err) {
                        setterAfterFilter(v, set);
                    }
                    else {
                        throw new TypeError(`${k}: ${v}, ${err}`);
                    }
                } :
                function (v) {
                    setterAfterFilter(v, set);
                };
            const getter = p.getter || function () {
                return o[hiddenKey];
            };
            Object.defineProperty(o, k, {
                enumerable: true,
                configurable: false,
                set: setter,
                get: getter
            });
        }
    }
});

//File for making linear animations

class Animation {
    static animationName = "animation";
    animationName = "animation";

    static getJsonSchema = (valueSchema) => ({
        properties: {
            startValue: valueSchema,
            endValue: valueSchema,
            reversed: { type: "boolean" }
        },
        required: ["startValue", "endValue", "reversed"]
    })

    static fromJson(json, parse = true, throwErrors = false) {
        if (typeof json === 'string' && parse === true) {
            try {
                json = JSON.parse(json);
            }
            catch (e) {
                if (throwErrors) {
                    throw e;
                }
                else {
                    return false;
                }
            }
        }
        else if (parse !== false) {
            throw new TypeError("Cannot parse non string json.");
        }
        try {
            let { startValue, endValue, reversed } = json;
            let animation = new Animation(startValue, endValue);
            if (reversed) {
                animation.reverse();
            }
            return animation;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    }

    constructor() {
        typedFunction([
            {
                name: "startValue",
                type: Types.OBJECT
            },
            {
                name: "endValue",
                type: Types.OBJECT
            }
        ], function (startValue, endValue) {
            function checkProperties(s, e) {
                //Make sure that endValue doesn't have properties that startValue doesn't have.
                let sKeys = Object.keys(s);
                let eKeys = Object.keys(e);
                for (var i = 0; i < eKeys.length; i++) {
                    let key = eKeys[i];
                    if (!sKeys.includes(key)) {
                        return `${key} is included in endValue but not in startValue.`;
                    }
                }
                for (let k in s) {
                    if (s.hasOwnProperty(k)) {
                        let v = s[k];
                        function checkProperty() {
                            switch (typeof v) {
                                case 'object':
                                    let err = checkProperties(v, e[k]);
                                    if (!err) {
                                        return false;
                                    }
                                    else {
                                        return `${k}.${err}`;
                                    }
                                case 'number':
                                    if (e.hasOwnProperty(k)) {
                                        let sType = typeof v;
                                        let eType = typeof e[k];
                                        if (sType === eType) {
                                            return false
                                        }
                                        else {
                                            return `${k} is a ${sType} in startValue but a ${eType} in endValue.`;
                                        }
                                    }
                                    else {
                                        return `${k} is in startValue but not in endValue.`;
                                    }
                                default:
                                    return `${k} is not a number.`;
                            }
                        }
                        let err = checkProperty();
                        if (err) {
                            return err;
                        }
                    }
                }
            }            let err = checkProperties(startValue, endValue);
            if (!err) {
                this.startValue = startValue;
                this.endValue = endValue;
            }
            else {
                throw new TypeError(`Bad values because property: ${err}`);
            }
        }).apply(this, arguments);
    }

    calculate() {
        return typedFunction([{ name: "progress", type: Types.UNIT_INTERVAL }], function (progress) {
            //If the reverse effect is enabled, then alter the progress.
            if (this.reversed) {
                progress = 1 - Math.abs(progress * 2 - 1);
            }
            const calcNumber = (s, e) => s + progress * (e - s);
            const calcObject = (s, e) => {
                var o;
                if (s instanceof Array && e instanceof Array) {
                    o = [];
                }
                else {
                    o = {};
                }
                for (var k in s) {
                    let sV = s[k];
                    let eV = e[k];
                    switch (typeof sV) {
                        case 'object':
                            o[k] = calcObject(sV, eV);
                            break;
                        case 'number':
                            o[k] = calcNumber(sV, eV);
                            break;
                    }
                }
                return o;
            };
            return calcObject(this.startValue, this.endValue);
        }).apply(this, arguments);
    }

    lasts = false;
    last() {
        this.lasts = true;
        return this;
    }

    reversed = false;
    reverse() {
        this.reversed = true;
        return this;
    }

    toJson(stringify = true) {
        let o = {
            startValue: this.startValue,
            endValue: this.endValue,
            reversed: this.reversed
        };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Class for precalculated animations. Created implicitly when exporting and importing json.

//Precomputed class
class Precomputed {
    static animationName = "precomputed";
    animationName = "precomputed";

    static getJsonSchema = (valueSchema) => ({
        type: "array",
        items: {
            type: "array",
            items: [
                { type: "number", minimum: 0 },
                valueSchema
            ],
            minItems: 2,
            maxItems: 2
        }
    })

    static fromJson(json, parse = true, throwErrors = false) {
        if (typeof json === 'string' && parse === true) {
            try {
                json = JSON.parse(json);
            }
            catch (e) {
                if (throwErrors) {
                    throw e;
                }
                else {
                    return false;
                }
            }
        }
        else if (parse !== false) {
            throw new TypeError("Cannot parse non string json.");
        }
        try {
            return new Precomputed(json);
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    }

    constructor(values) {
        if (values instanceof Array) {
            for (var i = 0; i < values.length; i++) {
                let entry = values[i];
                if (!(entry instanceof Array && entry.length === 2 && typeof entry[0] === 'number' && entry[0] >= 0 && entry[0] <= 1 && typeof entry[1] ===
                    'object')) {
                    throw new TypeError("All entries must be [number (between 0 and 1), object].");
                }
            }
            this.values = values;
        }
        else {
            throw new TypeError("Values must be an array.");
        }
    }

    calculate(progress) {
        if (typeof progress === 'number' && progress >= 0 && progress <= 1) {
            this.values.sort((a, b) => a[0] - b[0]);
            for (var i = 0; i < this.values.length; i++) {
                let changeAt = this.values[i][0];
                if (progress < changeAt) {
                    if (i > 0) {
                        return this.values[i - 1][1];
                    }
                    else {
                        return {};
                    }
                }
            }
            return i > 0 ? this.values[i - 1][1] : {};
        }
        else {
            throw new TypeError("progress must be a number between 0 and 1.");
        }
    }

    lasts = false;
    last() {
        this.lasts = true;
        return this;
    }

    toJson(stringify = true) {
        if (stringify === true) {
            return JSON.stringify(this.values);
        }
        else if (stringify === false) {
            return this.values;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Manage animatable properties

//Properties type
const propertiesType$1 = keyValueObject(either(Types.TYPE, interfaceToType({
    type: {
        type: Types.TYPE,
        required: false
    },
    setter: {
        type: Types.FUNCTION,
        required: false
    },
    getter: {
        type: Types.FUNCTION,
        required: false
    },
    initial: {
        type: Types.ANY,
        required: false
    },
    toJson: {
        type: Types.FUNCTION,
        required: false
    }
}, false)));

//Animator interface
const animatorInterface = new Interface(true)
    .optional("name", Types.STRING)
    .toType();

const params$1 = [
    {
        name: "o",
        type: Types.OBJECT
    },
    {
        name: "properties",
        type: propertiesType$1
    },
    {
        name: "methodsToBind", type: methodsToBindType
    }
];

//List of built in animations
const builtInAnimations = new Set()
    .add(Animation)
    .add(Precomputed);

const animanage = typedFunction(params$1, function (o, properties, methodsToBind) {
    //List of properties that were explicitly set
    var explicit = new Set();

    //Add properties, getters/setters, hidden properties, and toJson.
    var oInterface = new Interface(false);
    var propertiesToDefine = {};
    var propertiesToJson = new Map();
    for (let k in properties) {
        let p = properties[k];
        let type = p.type || p;
        let hiddenKey = '_' + k;
        if (p.hasOwnProperty("initial")) {
            Object.defineProperty(o, hiddenKey, {
                configurable: true,
                enumerable: false,
                value: p.initial
            });
        }
        let setFunction = function (v) {
            Object.defineProperty(o, hiddenKey, {
                configurable: true,
                enumerable: false,
                value: v
            });
        };
        let setterAfterFilter = (p.setter || setFunction).bind(o);
        let setter = type ?
            function (v) {
                explicit.add(k);
                let err = type(v);
                if (!err) {
                    return setterAfterFilter(v, setFunction);
                }
                else {
                    throw new TypeError(`${k}: ${v}, ${err}`);
                }
            } :
            function (v) {
                explicit.add(k);
                return setterAfterFilter(v, setFunction);
            };
        let getter = p.getter || function () {
            return o[hiddenKey];
        };
        let property = {
            configurable: false,
            enumerable: true,
            set: setter,
            get: getter
        };
        propertiesToDefine[k] = property;
        Object.defineProperty(o, k, property);
        oInterface.optional(k, type || Types.ANY);
        if (p.hasOwnProperty("toJson")) {
            propertiesToJson.set(k, p.toJson);
        }
    }
    oInterface = oInterface.toType();
    //Add the isExplicitlySet function
    Object.defineProperty(o, "isExplicitlySet", {
        enumerable: true,
        configurable: false,
        value: typedFunction([{ name: "key", type: Types.STRING }], function (key) {
            return explicit.has(key);
        })
    });
    //Add the animate function
    var animations = o.animations = [];
    //Add the toJson method to the animations
    animations.toJson = function (stringify = true, fps = 60) {
        let arr = [];
        if (typeof fps === 'number' && fps > 0) {
            for (var i = 0; i < animations.length; i++) {
                let { startTime, duration, animator, isCalculator, isCustom } = animations[i];
                let o = {
                    startTime,
                    duration
                };
                if (isCalculator) {
                    o.name = undefined;
                    o.lasts = false;
                }
                else {
                    o.name = animator.animationName || undefined;
                    o.lasts = animator.lasts || false;
                }
                if (isCalculator || isCustom && !(typeof animator.toJson === 'function')) {
                    //Implicitly create a precomputed animation
                    let values = [];
                    for (var j = 0; j <= 1; j += 1 / fps) {
                        values.push([j, animator(j)]);
                    }
                    var implicitPrecomputed = new Precomputed(values);
                    o.name = Precomputed.animationName;
                    o.data = implicitPrecomputed.toJson(false);
                    o.isBuiltin = true;
                }
                else {
                    o.data = animator.toJson(false);
                    o.isBuiltin = !isCustom;
                }
                arr.push(o);
            }
        }
        else {
            throw new TypeError("fps must be a positive number.");
        }
        if (stringify === true) {
            return JSON.stringify(arr);
        }
        else if (stringify === false) {
            return arr;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    };
    //Add the importJson method to the animations
    animations.importJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, caMappings = new Map()) {
        if (parse) {
            json = JSON.parse(json);
        }
        if (json instanceof Array) {
            for (var { startTime, duration, isBuiltin, name, lasts, data } of json) {
                var animation = {
                    startTime,
                    duration,
                    isCalculator: false
                };
                if (isBuiltin) {
                    let notFound = true;
                    animation.isCustom = false;
                    for (var builtinAnimation of builtInAnimations) {
                        if (name === builtinAnimation.animationName) {
                            notFound = false;
                            animation.animator = builtinAnimation.fromJson(data, false, true);
                            animation.animator.lasts = lasts;
                            break;
                        }
                    }
                    if (notFound) {
                        throw new TypeError(`There is not builtin animation called: ${name}.`);
                    }
                }
                else if (caMappings.has(name)) {
                    animation.isCustom = true;
                    animation.animator = caMappings.get(name)(data, false, true);
                    animation.animator.lasts = lasts;
                }
                else {
                    throw new TypeError(`Unknown custom animation name: ${name}.`);
                }
                animations.push(animation);
            }
        }
        else {
            throw new TypeError("animations is not an array.");
        }
        return animations;
    });
    Object.defineProperty(o, "animate", {
        enumerable: true,
        configurable: false,
        value: typedFunction([
            { name: "startTime", type: Types.NON_NEGATIVE_NUMBER },
            { name: "duration", type: Types.NON_NEGATIVE_NUMBER },
            { name: "animator", type: either(animatorInterface, Types.FUNCTION) }], function (startTime, duration, animator) {
                let animation = {
                    startTime,
                    duration,
                    animator,
                    isCalculator: typeof animator === 'function',
                    isCustom: true
                };
                if (typeof animator === 'object') {
                    for (let builtin of builtInAnimations) {
                        if (Object.getPrototypeOf(animator) === builtin.prototype) {
                            animation.isCustom = false;
                            break;
                        }
                    }
                }
                animations.push(animation);
                return this;
            })
    });
    //Add the propertyToJson method
    Object.defineProperty(o, "propertyToJson", {
        enumerable: true,
        configurable: false,
        value: typedFunction([
            { name: "property", type: Types.KEY },
            { name: "stringify", optional: true, type: Types.BOOLEAN },
            { name: "fps", type: Types.POSITIVE_NUMBER, optional: true }
        ], function (property) {
            if (propertiesToJson.has(property, stringify = true, fps = 60)) {
                let jsonProperty = propertiesToJson.get(property).call(o[property], fps);
                return stringify ? JSON.stringify(jsonProperty) : jsonProperty;
            }
            else {
                throw new TypeError(`No toJson function specified for given property: ${property}.`);
            }
        })
    });
    //Add the set function
    var sets = o.sets = [];
    //Add the toJson method to the sets
    sets.toJson = function (stringify = true, fps = 60) {
        let arr = [];
        for (var i = 0; i < sets.length; i++) {
            let { at, value } = sets[i];
            let jsonValue = {};
            for (var k in value) {
                if (propertiesToJson.has(k)) {
                    jsonValue[k] = propertiesToJson.get(k).call(value[k], fps);
                }
                else {
                    jsonValue[k] = value[k];
                }
            }
            arr.push({ at, value: jsonValue });
        }
        if (stringify === true) {
            return JSON.stringify(arr);
        }
        else if (stringify === false) {
            return arr;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    };
    Object.defineProperty(o, "set", {
        enumerable: true,
        configurable: false,
        value: typedFunction([
            { name: "at", type: Types.NON_NEGATIVE_NUMBER },
            { name: "value", type: oInterface }], function (at, value) {
                sets.push({ at, value });
                return this;
            })
    });
    sets.importJson = function (json, parse = true) {
        if (typeof json === 'string' && parse === true) {
            json = JSON.parse(json);
        }
        else if (parse !== false) {
            throw new TypeError("Cannot parse non string json.");
        }
        if (json instanceof Array) {
            for (let { at, value } of json) {
                o.set(at, value);
            }
        }
        else {
            throw new TypeError("json is not an array.");
        }
        return sets;
    };
    //Add the at function.
    Object.defineProperty(o, "at", {
        enumerable: true,
        configurable: false,
        value: typedFunction([{ name: "time", type: Types.NON_NEGATIVE_NUMBER }], function (time) {
            var at = {};
            //Copy all values
            var keys = Object.getOwnPropertyNames(this);
            for (var i = 0; i < keys.length; i++) {
                let k = keys[i];
                if (!["animate", "at", "set"].includes(k)) {
                    let v = this[k];
                    if (typeof v === 'function') {
                        at[k] = v.bind(at);
                    }
                    else {
                        at[k] = v;
                    }
                }
            }
            Object.defineProperties(at, { ...propertiesToDefine });
            //Bind all methods
            for (var i = 0; i < methodsToBind.length; i++) {
                let method = methodsToBind[i];
                let thisMethod = Object.getPrototypeOf(this)[method];
                if (thisMethod) {
                    at[method] = thisMethod.bind(at);
                }
                else {
                    throw new TypeError(`Couldn't bind method: ${method}`);
                }
            }
            //Loop through all sets
            for (var i = 0; i < sets.length; i++) {
                let set = sets[i];
                if (time >= set.at) {
                    at = Object.assign(at, set.value);
                }
            }
            //Loop through all animations
            for (var i = 0; i < animations.length; i++) {
                let a = animations[i];
                if (time >= a.startTime && time < a.startTime + a.duration) {
                    let progress = (time - a.startTime) / a.duration;
                    runCalculator(progress);
                }
                else if (time > a.startTime + a.duration && a.lasts) {
                    runCalculator(1);
                }
                function runCalculator(progress) {
                    let value = a.isCalculator ? a.animator(progress) : a.animator.calculate(progress);
                    let err = oInterface(value);
                    if (!err) {
                        at = Object.assign(at, value);
                    }
                    else {
                        throw new TypeError(`Problem with animate function: ${err}`);
                    }
                }
            }
            //Set a key on the at object called at
            //This is so that shapes know what time it is
            //The group shape needs this
            //Also it's okay because the at property is a reserved method anyway
            at.at = time;
            //The final at object
            return at;
        })
    });
});

//Camera for scenes

//Camera class
class Camera {
    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true }
    ], function (json, parse = true, throwErrors = false) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let { scaleX, scaleY, refX, refY, x, y } = json;
            return new Camera()
                .setScale(scaleX, scaleY)
                .setRef(refX, refY)
                .setPosition(x, y);
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor() {
        animanage(this, {
            scaleX: Types.NUMBER,
            scaleY: Types.NUMBER,
            refX: Types.NUMBER,
            refY: Types.NUMBER,
            x: Types.NUMBER,
            y: Types.NUMBER,
        }, []);

        this.scaleX = 1;
        this.scaleY = 1;
        this.refX = 0;
        this.refY = 0;
        this.x = 0;
        this.y = 0;
    }

    setScaleX(x) {
        this.scaleX = x;
        return this;
    }
    setScaleY(y) {
        this.scaleY = y;
        return this;
    }
    setScale(x, y) {
        this.scaleX = x, this.scaleY = y;
        return this;
    }

    setRefX(x) {
        this.refX = x;
        return this;
    }
    setRefY(y) {
        this.refY = y;
        return this;
    }
    setRef(x, y) {
        this.refX = x, this.refY = y;
        return this;
    }

    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.x = y;
        return this;
    }
    setPosition(x, y) {
        this.x = x, this.y = y;
        return this;
    }

    toJson(stringify = true) {
        let { scaleX, scaleY, refX, refY, x, y } = this;
        let o = { scaleX, scaleY, refX, refY, x, y };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Color Type

//Color interface
const colorInterface = new Interface(false)
    .optional('r', Types.RGB_INTENSITY)
    .optional('g', Types.RGB_INTENSITY)
    .optional('b', Types.RGB_INTENSITY)
    .optional('a', Types.UNIT_INTERVAL)
    .toType();

//Input either a color interface or a string representation of a color
const colorType = either(colorInterface, Types.COLOR);

//Interface for camera

//Camera interface
const cameraInterface = new Interface(true)
    .required("scaleX", Types.NUMBER)
    .required("scaleY", Types.NUMBER)
    .required("refX", Types.NUMBER)
    .required("refY", Types.NUMBER)
    .required("x", Types.NUMBER)
    .required("y", Types.NUMBER)
    .toType();

const hexStringSchema = {
    title: "Color",
    description: "Color hex string.",
    type: "string",
    pattern: "^#?([0-9a-fA-F]{2}){3,4}$"
};

//File which contains Shape class

//Both fillColor and strokeColor use this
const animateColor = {
    r: "number",
    g: "number",
    b: "number",
    a: "number"
};

//Get a value schema
const getValueSchema = (properties) => {
    const getSchema = properties => {
        const getProperty = v => {
            switch (typeof v) {
                case "string":
                    if (v === "number") {
                        return { type: "number" };
                    }
                    else {
                        throw new TypeError("Unknown type");
                    }
                case "object": {
                    return getSchema(v);
                }
            }
        };
        if (properties instanceof Array) {
            return {
                type: "array",
                items: getProperty(properties[0])
            };
        }
        else {
            let valueProperties = {};
            for (let k in properties) {
                valueProperties[k] = getProperty(properties[k]);
            }
            return {
                properties: valueProperties,
                type: "object",
                additionalProperties: false
            };
        }
    };
    return getSchema(properties);
};

//Shape class
class Shape {
    static shapeName = "shape";
    shapeName = "shape";

    static getJsonSchema = (properties, requiredProperties, animateProperties) => {
        let animateSchema = getValueSchema(animateProperties);
        return {
            properties: {
                ...properties,
                animations: {
                    type: "array",
                    items: {
                        properties: {
                            startTime: { type: "number", minimum: 0 },
                            duration: { type: "number", minimum: 0 },
                            isBuiltin: { ype: "boolean" },
                            name: { type: "string" },
                            lasts: { type: "boolean" }
                        },
                        required: ["startTime", "duration", "isBuiltin", "lasts"],
                        if: { properties: { isBuiltin: { const: true } } },
                        then: {
                            properties: { name: { enum: ["animation", "precomputed"] } },
                            required: ["name", "data"],
                            allOf: [
                                {
                                    if: { properties: { name: { const: "animation" } } },
                                    then: {
                                        properties: {
                                            data: Animation.getJsonSchema(animateSchema)
                                        }
                                    }
                                },
                                {
                                    if: { properties: { name: { const: "precomputed" } } },
                                    then: {
                                        properties: {
                                            data: Precomputed.getJsonSchema(animateSchema)
                                        }
                                    }
                                }
                            ]
                        },
                        else: {
                            properties: { name: { type: "string" } }
                        }
                    }
                },
                sets: {
                    type: "array",
                    items: {
                        properties: {
                            at: { type: "number", minimum: 0 },
                            value: animateSchema
                        },
                        required: ["at", "value"]
                    }
                }
            },
            required: [...new Set([...requiredProperties, "animations", "sets"])],
            additionalProperties: false
        }
    }
    static jsonPropertiesSchema = {
        fillColor: hexStringSchema,
        strokeColor: hexStringSchema,
        strokeWidth: { type: "number", minimum: 0 }
    }
    static jsonRequiredProperties = []
    static animateProperties = {
        fillColor: animateColor,
        strokeColor: animateColor,
        strokeWidth: "number"
    }
    static jsonSchema = this.getJsonSchema(
        this.jsonPropertiesSchema,
        this.jsonRequiredProperties,
        this.animateProperties
    )

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true },
        { name: "shape", type: instanceOf(Shape), optional: true }
    ], function (json, parse = true, throwErrors = false, caMappings = new Map(), shape) {
        let shapeGiven = false;
        if (shape instanceof Shape) {
            shapeGiven = true;
        }
        else {
            shape = new Shape();
        }
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            var { fillColor, strokeColor, strokeWidth, animations, sets } = json;
            if (fillColor) {
                shape.fill(fillColor);
            }
            if (strokeColor) {
                shape.stroke(strokeColor, strokeWidth);
            }
            shape.animations.importJson(animations, false, caMappings);
            shape.sets.importJson(sets, false);
            return shapeGiven ? [shape, json] : shape;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor() {
        typedFunction([
            {
                name: "properties",
                type: propertiesType$1,
                optional: true,
                default: {}
            },
            {
                name: "methodsToBind",
                type: methodsToBindType,
                optional: true,
                default: []
            }
        ], function (properties = {}, methodsToBind = []) {
            const shapeProperties = {
                fillColor: {
                    type: colorType,
                    initial: new tinyColor(),
                    setter: function (v, set) {
                        if (typeof v === 'object') {
                            set(new tinyColor(Object.assign(this.fillColor, v)));
                        }
                        else {
                            set(new tinyColor(v));
                        }
                    },
                    getter: function () {
                        let colors = this._fillColor.toRgb();
                        colors.hexString = this._fillColor.toHexString();
                        return colors;
                    }
                },
                strokeColor: {
                    type: colorType,
                    initial: new tinyColor(),
                    setter: function (v, set) {
                        if (typeof v === 'object') {
                            set(new tinyColor(Object.assign(this.strokeColor, v)));
                        }
                        else {
                            set(new tinyColor(v));
                        }
                    },
                    getter: function () {
                        let colors = this._strokeColor.toRgb();
                        colors.hexString = this._strokeColor.toHexString();
                        return colors;
                    }
                },
                strokeWidth: {
                    type: Types.NON_NEGATIVE_NUMBER,
                    initial: 0
                }
            };

            properties = Object.assign(properties, shapeProperties);

            const shapeMethodsToBind = ["draw"];
            methodsToBind = [...new Set([...shapeMethodsToBind, ...methodsToBind])];

            animanage(this, properties, methodsToBind);
        }).apply(this, arguments);
    }

    fill(color) {
        this.fillColor = color;
        return this;
    }
    stroke(color, width = this.strokeWidth) {
        this.strokeColor = color;
        this.strokeWidth = width;
        return this;
    }
    draw() {
        return typedFunction([{ name: "ctx", type: Types.CANVAS_CTX }], function (ctx) {
            if (this.isExplicitlySet("fillColor")) {
                ctx.fillStyle = this.fillColor.hexString;
            }
            if (this.isExplicitlySet("strokeColor")) {
                ctx.strokeStyle = this.strokeColor.hexString;
            }
            if (this.isExplicitlySet("strokeWidth")) {
                ctx.lineWidth = this.strokeWidth;
            }
            return this;
        }).apply(this, arguments);
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            fillColor: this.isExplicitlySet("fillColor") ? this.fillColor.hexString : undefined,
            strokeColor: this.isExplicitlySet("strokeColor") ? this.strokeColor.hexString : undefined,
            strokeWidth: this.isExplicitlySet("strokeWidth") ? this.strokeWidth : undefined,
            animations: this.animations.toJson(false, fps),
            sets: this.sets.toJson(false)
        };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Because this is used by so many shapes
const numberSchema = {
    type: "number"
};

const positiveNumberSchema = {
    ...numberSchema,
    exclusiveMinimum: 0
};

//File for creating rectangle class

//Corner round interface
const cornerRoundInterface = new Interface(false)
    .optional("topLeft", Types.NON_NEGATIVE_NUMBER)
    .optional("topRight", Types.NON_NEGATIVE_NUMBER)
    .optional("bottomLeft", Types.NON_NEGATIVE_NUMBER)
    .optional("bottomRight", Types.NON_NEGATIVE_NUMBER)
    .toType();
//Corner round array
const cornerRoundArray = arrayOf(Types.NON_NEGATIVE_NUMBER, 4);
//Corner round type
const cornerRoundType = either(Types.NON_NEGATIVE_NUMBER, cornerRoundInterface, cornerRoundArray);

//Two corners array
const twoCornersArray = arrayOf(Types.NON_NEGATIVE_NUMBER, 2);
//Vertical corner round interface
const verticalCornerRoundInterface = new Interface(false)
    .optional("left", Types.NON_NEGATIVE_NUMBER)
    .optional("right", Types.NON_NEGATIVE_NUMBER)
    .toType();
//Vertical corner round type
const verticalCornerRoundType = either(Types.NON_NEGATIVE_NUMBER, verticalCornerRoundInterface, twoCornersArray);

//Horizontal corner round interface
const horizontalCornerRoundInterface = new Interface(false)
    .optional("top", Types.NON_NEGATIVE_NUMBER)
    .optional("left", Types.NON_NEGATIVE_NUMBER)
    .toType();
//Horizontal corner round type
const horizontalCornerRoundType = either(Types.NON_NEGATIVE_NUMBER, horizontalCornerRoundInterface, twoCornersArray);

//Rectangle class
class Rectangle extends Shape {
    static shapeName = "rectangle";
    shapeName = "rectangle";

    static jsonPropertiesSchema = {
        ...Shape.jsonPropertiesSchema,
        x: numberSchema,
        y: numberSchema,
        width: numberSchema,
        height: numberSchema
    }
    static jsonRequiredProperties = [
        ...Shape.jsonRequiredProperties,
        "x",
        "y",
        "width",
        "height"
    ]
    static animateProperties = {
        ...Shape.animateProperties,
        x: "number",
        y: "number",
        width: "number",
        height: "number"
    }
    static jsonSchema = this.getJsonSchema(
        this.jsonPropertiesSchema,
        this.jsonRequiredProperties,
        this.animateProperties
    )

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let [circle, {
                x, y,
                width, height,
                cornerRound: {
                    topLeft,
                    topRight,
                    bottomLeft,
                    bottomRight
                } }] = Shape.fromJson(json, false, true, caMappings, new Rectangle(0, 0, 0, 0));
            circle.x = x, circle.y = y;
            circle.width = width, circle.height = height;
            circle.cornerRound = {
                topLeft, topRight, bottomLeft, bottomRight
            };
            return circle;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor(x, y, width, height, cornerRound = 0) {
        super({
            x: Types.NUMBER,
            y: Types.NUMBER,
            width: Types.NUMBER,
            height: Types.NUMBER,
            topLeftCornerRound: {
                initial: 0,
                type: Types.NON_NEGATIVE_NUMBER
            },
            topRightCornerRound: {
                initial: 0,
                type: Types.NON_NEGATIVE_NUMBER
            },
            bottomLeftCornerRound: {
                initial: 0,
                type: Types.NON_NEGATIVE_NUMBER
            },
            bottomRightCornerRound: {
                initial: 0,
                type: Types.NON_NEGATIVE_NUMBER
            },
            cornerRound: {
                type: cornerRoundType,
                setter: function (v) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            this.topLeftCornerRound = v[0];
                            this.topRightCornerRound = v[1];
                            this.bottomLeftCornerRound = v[2];
                            this.bottomRightCornerRound = v[3];
                        }
                        else {
                            if (v.hasOwnProperty("topLeft")) {
                                this.topLeftCornerRound = v.topLeft;
                            }
                            if (v.hasOwnProperty("topRight")) {
                                this.topRightCornerRound = v.topRight;
                            }
                            if (v.hasOwnProperty("bottomLeft")) {
                                this.bottomLeftCornerRound = v.bottomLeft;
                            }
                            if (v.hasOwnProperty("bottomRight")) {
                                this.bottomRightCornerRound = v.bottomRight;
                            }
                        }
                    }
                    else {
                        this.topLeftCornerRound = v;
                        this.topRightCornerRound = v;
                        this.bottomLeftCornerRound = v;
                        this.bottomRightCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        topLeft: this.topLeftCornerRound,
                        topRight: this.topRightCornerRound,
                        bottomLeft: this.bottomLeftCornerRound,
                        bottomRight: this.bottomRightCornerRound
                    };
                }
            },
            topCornerRound: {
                type: verticalCornerRoundType,
                setter: function (v) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            this.topLeftCornerRound = v[0];
                            this.topRightCornerRound = v[1];
                        }
                        else {
                            if (v.hasOwnProperty("left")) {
                                this.topLeftCornerRound = v["left"];
                            }
                            if (v.hasOwnProperty("right")) {
                                this.topRightCornerRound = v["right"];
                            }
                        }
                    }
                    else {
                        this.topLeftCornerRound = v;
                        this.topRightCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        left: this.topLeftCornerRound,
                        right: this.topRightCornerRound
                    };
                }
            },
            bottomCornerRound: {
                type: verticalCornerRoundType,
                setter: function (v) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            this.bottomLeftCornerRound = v[0];
                            this.bottomRightCornerRound = v[1];
                        }
                        else {
                            if (v.hasOwnProperty("left")) {
                                this.bottomLeftCornerRound = v["left"];
                            }
                            if (v.hasOwnProperty("right")) {
                                this.bottomRightCornerRound = v["right"];
                            }
                        }
                    }
                    else {
                        this.bottomLeftCornerRound = v;
                        this.bottomRightCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        left: this.bottomLeftCornerRound,
                        right: this.bottomRightCornerRound
                    };
                }
            },
            leftCornerRound: {
                type: horizontalCornerRoundType,
                setter: function (v, set) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            v.topLeftCornerRound = v[0];
                            v.bottomLeftCornerRound = v[1];
                        }
                        else {
                            if (v.hasOwnProperty("top")) {
                                this.topLeftCornerRound = v["top"];
                            }
                            if (v.hasOwnProperty("bottom")) {
                                this.bottomLeftCornerRound = v["bottom"];
                            }
                        }
                    }
                    else {
                        this.topLeftCornerRound = v;
                        this.bottomLeftCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        top: this.topLeftCornerRound,
                        bottom: this.bottomLeftCornerRound
                    };
                }
            },
            rightCornerRound: {
                type: horizontalCornerRoundType,
                setter: function (v, set) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            v.topRightCornerRound = v[0];
                            v.bottomRightCornerRound = v[1];
                        }
                        else {
                            if (v.hasOwnProperty("top")) {
                                this.topRightCornerRound = v["top"];
                            }
                            if (v.hasOwnProperty("bottom")) {
                                this.bottomRightCornerRound = v["bottom"];
                            }
                        }
                    }
                    else {
                        this.topRightCornerRound = v;
                        this.bottomRightCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        top: this.topRightCornerRound,
                        bottom: this.bottomRightCornerRound
                    };
                }
            }
        }, []);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.cornerRound = cornerRound;
    }

    setTopLeftCornerRound(cornerRound) {
        this.topLeftCornerRound = cornerRound;
        return this;
    }
    setTopRightCornerRound(cornerRound) {
        this.topRightCornerRound = cornerRound;
        return this;
    }
    setBottomLeftCornerRound(cornerRound) {
        this.bottomLeftCornerRound = cornerRound;
        return this;
    }
    setBottomRightCornerRound(cornerRound) {
        this.bottomRightCornerRound = cornerRound;
        return this;
    }

    setCornerRound() {
        if (arguments.length > 1) {
            this.cornerRound = [...arguments];
        }
        else {
            this.cornerRound = arguments[0];
        }
        return this;
    }
    setTopCornerRound() {
        if (arguments.length > 1) {
            this.topCornerRound = [...arguments];
        }
        else {
            this.topCornerRound = arguments[0];
        }
        return this;
    }
    setBottomCornerRound() {
        if (arguments.length > 1) {
            this.bottomCornerRound = [...arguments];
        }
        else {
            this.bottomCornerRound = arguments[0];
        }
        return this;
    }
    setLeftCornerRound() {
        if (arguments.length > 1) {
            this.leftCornerRound = [...arguments];
        }
        else {
            this.leftCornerRound = arguments[0];
        }
        return this;
    }
    setRightCornerRound() {
        if (arguments.length > 1) {
            this.rightCornerRound = [...arguments];
        }
        else {
            this.rightCornerRound = arguments[0];
        }
        return this;
    }

    draw(ctx) {
        super.draw(ctx);

        var maxRound = Math.min(this.height / 2, this.width / 2);
        this.topLeftCornerRound = Math.min(this.topLeftCornerRound, maxRound);
        this.topRightCornerRound = Math.min(this.topRightCornerRound, maxRound);
        this.bottomLeftCornerRound = Math.min(this.bottomLeftCornerRound, maxRound);
        this.bottomRightCornerRound = Math.min(this.bottomRightCornerRound, maxRound);

        var topLeft = this.x + this.topLeftCornerRound;
        var topRight = this.x + this.width - this.topRightCornerRound;
        var rightTop = this.y + this.topRightCornerRound;
        var rightBottom = this.y + this.height - this.bottomRightCornerRound;
        var bottomRight = this.x + this.width - this.bottomRightCornerRound;
        var bottomLeft = this.x + this.bottomLeftCornerRound;
        var leftBottom = this.y + this.height - this.bottomLeftCornerRound;
        var leftTop = this.y + this.topLeftCornerRound;

        ctx.beginPath();
        ctx.moveTo(topLeft, this.y);
        ctx.lineTo(topRight, this.y);
        ctx.arc(topRight, rightTop, this.topRightCornerRound, -Math.PI / 2, 0);
        ctx.lineTo(this.x + this.width, rightBottom);
        ctx.arc(bottomRight, rightBottom, this.bottomRightCornerRound, 0, Math.PI / 2);
        ctx.lineTo(bottomLeft, this.y + this.height);
        ctx.arc(bottomLeft, leftBottom, this.bottomLeftCornerRound, Math.PI / 2, Math.PI);
        ctx.lineTo(this.x, leftTop);
        ctx.arc(leftTop, topLeft, this.topLeftCornerRound, Math.PI, Math.PI * 3 / 2);
        ctx.closePath();
        ctx.fill();
        if (this.strokeWidth > 0) {
            ctx.stroke();
        }

        return this;
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            ...super.toJson(false, fps),
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            cornerRound: this.cornerRound
        };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Common file for point interface (x, y)

//Point interface
const pointInterface = new Interface(false)
    .required("x", Types.NUMBER)
    .required("y", Types.NUMBER)
    .toType();

//Draw circles

//Circle class
class Circle extends Shape {
    static shapeName = "circle";
    shapeName = "circle";

    static jsonPropertiesSchema = {
        ...Shape.jsonPropertiesSchema,
        cx: numberSchema,
        cy: numberSchema,
        r: positiveNumberSchema
    }
    static jsonRequiredProperties = [
        ...Shape.jsonRequiredProperties,
        "cx",
        "cy",
        "r"
    ]
    static animateProperties = {
        ...Shape.animateProperties,
        cx: "number",
        cy: "number",
        r: "number"
    }
    static jsonSchema = this.getJsonSchema(
        this.jsonPropertiesSchema,
        this.jsonRequiredProperties,
        this.animateProperties
    )

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let [circle, { cx, cy, r }] = Shape.fromJson(json, false, true, caMappings, new Circle(0, 0, 1));
            circle.cx = cx;
            circle.cy = cy;
            circle.r = r;
            return circle;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor(cx, cy, r) {
        super({
            cx: Types.NUMBER,
            cy: Types.NUMBER,
            r: Types.POSITIVE_NUMBER
        });

        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    setCx(cx) {
        this.cx = cx;
        return this;
    }
    setCy(cy) {
        this.cy = cy;
        return this;
    }
    setC() {
        new Overloader()
            .overload([{ type: Types.NUMBER }, { type: Types.NUMBER }], function (x, y) {
                this.cx = x, this.cy = y;
            })
            .overload([{ type: pointInterface }], function ({ x, y }) {
                this.cx = x, this.cy = y;
            })
            .overload([{ type: arrayOf(Types.NUMBER, 2) }], function ([x, y]) {
                this.cx = x, this.cy = y;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        if (this.strokeWidth > 0) {
            ctx.stroke();
        }

        return this;
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            ...super.toJson(false, fps),
            cx: this.cx,
            cy: this.cy,
            r: this.r
        };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Customizable number line shape

//Number line class
class NumberLine extends Shape {
    static shapeName = "numberLine";
    shapeName = "numberLine";

    static jsonPropertiesSchema = {
        ...Shape.jsonPropertiesSchema,
        startNumber: numberSchema,
        endNumber: numberSchema,
        x: numberSchema,
        y: numberSchema,
        width: positiveNumberSchema,
        height: positiveNumberSchema
    }
    static jsonRequiredProperties = [
        ...Shape.jsonRequiredProperties,
        "startNumber",
        "endNumber",
        "x",
        "y",
        "width",
        "height"
    ]
    static animateProperties = {
        ...Shape.animateProperties,
        startNumber: "number",
        endNumber: "number",
        x: "number",
        y: "number",
        width: "number",
        height: "number"
    }
    static jsonSchema = this.getJsonSchema(
        this.jsonPropertiesSchema,
        this.jsonRequiredProperties,
        this.animateProperties
    )

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let [numberLine, {
                startNumber, endNumber,
                x, y,
                width, height }] = Shape.fromJson(json, false, true, caMappings, new NumberLine(0, 1, 0, 0, 1, 1));
            numberLine.startNumber = startNumber, numberLine.endNumber = endNumber;
            numberLine.x = x, numberLine.y = y;
            numberLine.width = width, numberLine.height = height;
            return numberLine;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor(startNumber, endNumber, x, y, width, height) {
        super({
            startNumber: Types.NUMBER,
            endNumber: Types.NUMBER,
            x: Types.NUMBER,
            y: Types.NUMBER,
            width: Types.POSITIVE_NUMBER,
            height: Types.POSITIVE_NUMBER
        }, ["coordinateAt"]);
        this.startNumber = startNumber;
        this.endNumber = endNumber;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setPosition() {
        new Overloader()
            .overload([{ type: Types.NUMBER }, { type: Types.NUMBER }], function (x, y) {
                this.x = x, this.y = y;
            })
            .overload([{ type: pointInterface }], function ({ x, y }) {
                this.x = x, this.y = y;
            })
            .overload([{ type: arrayOf(Types.NUMBER, 2) }], function ([x, y]) {
                this.x = x, this.y = y;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    coordinateAt(n) {
        var intRatio = this.width / (this.endNumber - this.startNumber);
        return {
            x: this.x + n * intRatio,
            y: this.y
        };
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.beginPath();

        //Horizontal line
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);

        //Two ends
        var halfHeight = this.height / 2;
        ctx.moveTo(this.x, this.y - halfHeight);
        ctx.lineTo(this.x, this.y + halfHeight);
        ctx.moveTo(this.x + this.width, this.y - halfHeight);
        ctx.lineTo(this.x + this.width, this.y + halfHeight);

        //Draw at every integer
        ctx.font = `${this.height}px Sans-serif`;
        var maxDigits = Math.floor(this.endNumber).toString().length;
        var maxWidth = ctx.measureText("0".repeat(maxDigits)).width;
        var intRatio = this.width / (this.endNumber - this.startNumber);
        var interval = Math.ceil(((this.endNumber - this.startNumber) * maxWidth * 2) / this.width);
        for (var i = Math.ceil(this.startNumber); i <= Math.floor(this.endNumber); i += interval) {
            ctx.moveTo(this.x + i * intRatio, this.y - halfHeight);
            ctx.lineTo(this.x + i * intRatio, this.y + halfHeight);
            let intWidth = ctx.measureText(i.toString()).width;
            ctx.fillText(i.toString(), this.x + i * intRatio - intWidth / 2, this.y + this.height * 1.5);
        }

        ctx.closePath();
        ctx.stroke();

        return this;
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            ...super.toJson(false, fps),
            startNumber: this.startNumber,
            endNumber: this.endNumber,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Draw a path, similar to ctx path.

//Path class
class Path extends Shape {
    static shapeName = "path";
    shapeName = "path";

    static jsonPropertiesSchema = {
        ...Shape.jsonPropertiesSchema,
        doFill: { type: "boolean" },
        strokeDash: { type: "array", items: numberSchema },
        strokeDashOffset: numberSchema,
        operations: {
            type: "array",
            items: {
                anyOf: [
                    {
                        type: "array",
                        items: [
                            {
                                const: "moveTo"
                            },
                            {
                                type: "array",
                                items: [
                                    numberSchema,
                                    numberSchema
                                ],
                                minItems: 2,
                                maxItems: 2
                            }
                        ],
                        minItems: 2,
                        maxItems: 2
                    },
                    {
                        type: "array",
                        items: [
                            {
                                const: "lineTo"
                            },
                            {
                                type: "array",
                                items: [
                                    numberSchema,
                                    numberSchema
                                ],
                                minItems: 2,
                                maxItems: 2
                            }
                        ],
                        minItems: 2,
                        maxItems: 2
                    },
                    {
                        type: "array",
                        items: [
                            {
                                const: "arc"
                            },
                            {
                                type: "array",
                                items: [
                                    numberSchema,
                                    numberSchema,
                                    positiveNumberSchema,
                                    numberSchema,
                                    numberSchema,
                                    { type: "boolean" }
                                ],
                                minItems: 6,
                                maxItems: 6
                            }
                        ],
                        minItems: 2,
                        maxItems: 2
                    }
                ]
            }
        }
    }
    static jsonRequiredProperties = [
        ...Shape.jsonRequiredProperties,
        "doFill",
        "strokeDash",
        "strokeDashOffset",
        "operations"
    ]
    static animateProperties = {
        ...Shape.animateProperties,
        strokeDash: ["number"],
        strokeDashOffset: "number"
    }
    static jsonSchema = this.getJsonSchema(
        this.jsonPropertiesSchema,
        this.jsonRequiredProperties,
        this.animateProperties
    )

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let [path, {
                doFill, strokeDash, strokeDashOffset, operations
            }] = Shape.fromJson(json, false, true, caMappings, new Path());
            path.strokeDash = strokeDash;
            path.strokeDashOffset = strokeDashOffset;
            if (typeof doFill === 'boolean') {
                path.doFill = doFill;
            }
            else {
                throw new TypeError("path doFill must be a boolean.");
            }
            for (let [name, args] of operations) {
                if (["moveTo", "lineTo", "arc"].includes(name)) {
                    path[name](...args);
                }
                else {
                    throw new TypeError(`Unknown operation name: ${name}.`);
                }
            }
            return path;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor(fill = false) {
        if (typeof fill === 'boolean') {
            super({
                strokeDash: {
                    initial: [],
                    type: arrayOf(Types.NON_NEGATIVE_NUMBER)
                },
                strokeDashOffset: Types.NUMBER
            });
            this.operations = [];
            this.doFill = fill;
        }
        else {
            throw new TypeError("fill must be boolean.");
        }
    }

    setStrokeDash(strokeDash) {
        this.strokeDash = strokeDash;
        return this;
    }
    setStrokeDashOffset(strokeDashOffset) {
        this.strokeDashOffset = strokeDashOffset;
        return this;
    }

    moveTo(x, y) {
        typedFunction([{ name: "x", type: Types.NUMBER }, { name: "y", type: Types.NUMBER }], function (x, y) {
            this.operations.push(["moveTo", [x, y]]);
        }).call(this, x, y);
        return this;
    }
    lineTo(x, y) {
        typedFunction([{ name: "x", type: Types.NUMBER }, { name: "y", type: Types.NUMBER }], function (x, y) {
            this.operations.push(["lineTo", [x, y]]);
        }).call(this, x, y);
        return this;
    }
    arc() {
        typedFunction([
            { name: "x", type: Types.NUMBER },
            { name: "y", type: Types.NUMBER },
            { name: "radius", type: Types.NON_NEGATIVE_NUMBER },
            { name: "startAngle", type: Types.NUMBER },
            { name: "endAngle", type: Types.NUMBER },
            { name: "antiClockwise", type: Types.BOOLEAN, optional: true }
        ], function (x, y, radius, startAngle, endAngle, antiClockwise = false) {
            //Angles are in clock hour format (0 on top, 6 on bottom)
            //Convert clock hours to radians
            startAngle = (startAngle - 3) * Math.PI / 6;
            endAngle = (endAngle - 3) * Math.PI / 6;
            this.operations.push(["arc", [x, y, radius, startAngle, endAngle, antiClockwise]]);
        }).apply(this, arguments);
        return this;
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.setLineDash(this.strokeDash);
        ctx.lineDashOffset = this.strokeDashOffset;

        ctx.beginPath();
        for (var i = 0; i < this.operations.length; i++) {
            let [method, args] = this.operations[i];
            ctx[method](...args);
        }
        if (this.doFill) {
            ctx.closePath();
            ctx.fill();
        }
        if (this.strokeWidth > 0) {
            ctx.stroke();
        }

        return this;
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            ...super.toJson(false, fps),
            doFill: this.doFill,
            strokeDash: this.strokeDash,
            strokeDashOffset: this.strokeDashOffset,
            operations: this.operations
        };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Draw polygons with any number of sides

//Polygon class
class Polygon extends Shape {
    static shapeName = "polygon";
    shapeName = "polygon";

    static jsonPropertiesSchema = {
        ...Shape.jsonPropertiesSchema,
        points: {
            type: "array",
            items: {
                properties: {
                    x: numberSchema,
                    y: numberSchema
                },
                required: ["x", "y"]
            }
        }
    }
    static jsonRequiredProperties = [
        ...Shape.jsonRequiredProperties,
        "points"
    ]
    static animateProperties = {
        ...Shape.animateProperties,
        "points": [{
            x: "number",
            y: "number"
        }]
    }
    static jsonSchema = this.getJsonSchema(
        this.jsonPropertiesSchema,
        this.jsonRequiredProperties,
        this.animateProperties
    )

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let [polygon, { points }] = Shape.fromJson(json, false, true, caMappings, new Polygon());
            polygon.points = points;
            return polygon;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor() {
        super({
            points: {
                type: arrayOf(pointInterface),
                initial: []
            }
        });
        switch (typeof arguments[0]) {
            case 'number':
                if (arguments.length & 1) {
                    throw new TypeError("Cannot have odd number of arguments in a list of x, y.");
                }
                else {
                    for (var i = 0; i < arguments.length; i += 2) {
                        if (typeof arguments[i] === 'number' && typeof arguments[i + 1] === 'number') {
                            this.points.push({
                                x: arguments[i],
                                y: arguments[i + 1]
                            });
                        }
                        else {
                            throw new TypeError("Bad list of x and ys.");
                        }
                    }
                }
                break;
            case 'object':
                if (arguments[0] instanceof Array) {
                    for (var i = 0; i < arguments.length; i++) {
                        let arg = arguments[i];
                        if (arg instanceof Array && arg.length === 2) {
                            if (typeof arg[0] === 'number' && typeof arg[1] === "number") {
                                this.points.push({
                                    x: arg[0],
                                    y: arg[1]
                                });
                            }
                            else {
                                throw new TypeError("Expected [number, number].");
                            }
                        }
                        else {
                            throw new TypeError("Expected all args to be an array of [x, y].");
                        }
                    }
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        let arg = arguments[i];
                        let err = pointInterface(arg);
                        if (!err) {
                            this.points.push(arg);
                        }
                        else {
                            throw new TypeError(`point ${i}: ${arg}, ${err}`);
                        }
                    }
                }
                break;
            case 'undefined':
                if (arguments.length > 0) {
                    throw new TypeError("First argument cannot be undefined.");
                }
                break;
            default:
                throw new TypeError("Invalid construction.");
        }
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();
        if (this.strokeWidth > 0) {
            ctx.stroke();
        }

        return this;
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            ...super.toJson(false, fps),
            points: this.points
        };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

const refs = new Map();

const addRef = (v) => {
    let refsSize = refs.size.toString();
    refs.set(refsSize, v);
    return refsSize;
};

const setRef = (k, v) => {
    refs.set(k, v);
};

//Create groups of things

//This is referenced by the schema
const shapeNames = ["group"];
const groupRefKey = addRef();
const shapeDataSchemas = [
    {
        if: {
            properties: { name: { const: "group" } }
        },
        then: {
            properties: { data: { $ref: groupRefKey } }
        }
    }
];

//Size interface
const sizeInterface$1 = new Interface(false)
    .required("width", Types.POSITIVE_NUMBER)
    .required("height", Types.POSITIVE_NUMBER)
    .toType();

//Group class
class Group extends Shape {
    static shapeName = "group";
    shapeName = "group";

    static jsonPropertiesSchema = {
        ...Shape.jsonPropertiesSchema,
        x: numberSchema,
        y: numberSchema,
        originalWidth: positiveNumberSchema,
        originalHeight: positiveNumberSchema,
        refX: numberSchema,
        refY: numberSchema,
        width: positiveNumberSchema,
        height: positiveNumberSchema,
        children: {
            type: "array",
            items: {
                properties: {
                    isBuiltin: {
                        type: "boolean"
                    }
                },
                required: ["isBuiltin"],
                if: { properties: { isBuiltin: { const: true } } },
                then: {
                    properties: {
                        name: {
                            enum: shapeNames
                        }
                    },
                    required: ["name", "data"],
                    allOf: shapeDataSchemas
                },
                else: {
                    properties: {
                        name: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }
    static jsonRequiredProperties = [
        ...Shape.jsonRequiredProperties,
        "x",
        "y",
        "originalWidth",
        "originalHeight",
        "refX",
        "refY",
        "width",
        "height",
        "children"
    ]
    static animateProperties = {
        ...Shape.animateProperties,
        x: "number",
        y: "number",
        originalWidth: "number",
        originalHeight: "number",
        refX: "number",
        refY: "number",
        width: "number",
        height: "number",
    }
    static jsonSchema = this.getJsonSchema(
        this.jsonPropertiesSchema,
        this.jsonRequiredProperties,
        this.animateProperties
    )

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "csMappings", type: instanceOf(Map), optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, csMappings = new Map(), caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let [group, {
                x, y,
                originalWidth, originalHeight,
                refX, refY,
                width, height,
                children }] = Shape.fromJson(json, false, true, csMappings, new Group());
            group.x = x, group.y = y;
            group.originalWidth = originalWidth, group.originalHeight = originalHeight;
            group.refX = refX, group.refY = refY;
            group.width = width, group.height = height;
            for (let { isBuiltin, name, data } of children) {
                if (isBuiltin) {
                    var addedChild = false;
                    for (let shape of shapesList) {
                        if (name === shape.shapeName) {
                            switch (name) {
                                case Group.shapeName:
                                    group.add(shape.fromJson(data, false, true, csMappings, caMappings));
                                    break;
                                default:
                                    group.add(shape.fromJson(data, false, true, caMappings));
                                    break;
                            }
                            addedChild = true;
                            break;
                        }
                    }
                    if (!addedChild) {
                        throw new TypeError(`No builtin shape with name: ${name}.`);
                    }
                }
                else {
                    if (csMapping.has(name)) {
                        group.add(csMapping.get(name).fromJson(data, false, true));
                    }
                    else {
                        throw new TypeError(`No custom shape mappings for name: ${name}.`);
                    }
                }
            }
            return group;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor(x = 0, y = 0, originalWidth = 400, originalHeight = 400, refX = 0, refY = 0) {
        super({
            children: {
                initial: [],
                type: arrayOf(instanceOf(Shape))
            },
            x: Types.NUMBER,
            y: Types.NUMBER,
            originalWidth: Types.POSITIVE_NUMBER,
            originalHeight: Types.POSITIVE_NUMBER,
            refX: Types.NUMBER,
            refY: Types.NUMBER,
            width: Types.POSITIVE_NUMBER,
            height: Types.POSITIVE_NUMBER
        });

        this.x = x;
        this.y = y;
        this.originalWidth = originalWidth;
        this.originalHeight = originalHeight;
        this.refX = refX;
        this.refY = refY;
        this.width = originalWidth;
        this.height = originalHeight;
    }

    setOriginalWidth(width) {
        this.originalWidth = width;
        return this;
    }
    setOriginalHeight(height) {
        this.originalHeight = height;
    }
    setOriginalSize() {
        new Overloader()
            .overload([{ type: Types.POSITIVE_NUMBER }, { type: Types.POSITIVE_NUMBER }], function (width, height) {
                this.originalWidth = width;
                this.originalHeight = height;
            })
            .overload([{ type: sizeInterface$1 }], function ({ width, height }) {
                this.originalWidth = width;
                this.originalHeight = height;
            })
            .overload([{ type: arrayOf(Types.POSITIVE_NUMBER, 2) }], function ([width, height]) {
                this.originalWidth = width;
                this.originalHeight = height;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    setWidth(width) {
        this.width = width;
        return this;
    }
    setHeight(height) {
        this.height = height;
    }
    setSize() {
        new Overloader()
            .overload([{ type: Types.POSITIVE_NUMBER }, { type: Types.POSITIVE_NUMBER }], function (width, height) {
                this.width = width;
                this.height = height;
            })
            .overload([{ type: sizeInterface$1 }], function ({ width, height }) {
                this.width = width;
                this.height = height;
            })
            .overload([{ type: arrayOf(Types.POSITIVE_NUMBER, 2) }], function ([width, height]) {
                this.width = width;
                this.height = height;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.y = y;
        return this;
    }
    setPosition() {
        new Overloader()
            .overload([{ type: Types.NUMBER }, { type: Types.NUMBER }], function (x, y) {
                this.x = x, this.y = y;
            })
            .overload([{ type: pointInterface }], function ({ x, y }) {
                this.x = x, this.y = y;
            })
            .overload([{ type: arrayOf(Types.NUMBER, 2) }], function ([x, y]) {
                this.x = x, this.y = y;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    setRefX(x) {
        this.refX = x;
        return this;
    }
    setRefY(y) {
        this.y = y;
        return this;
    }
    setRef() {
        new Overloader()
            .overload([{ type: Types.NUMBER }, { type: Types.NUMBER }], function (x, y) {
                this.refX = x, this.refY = y;
            })
            .overload([{ type: pointInterface }], function ({ x, y }) {
                this.refX = x, this.refY = y;
            })
            .overload([{ type: arrayOf(Types.NUMBER, 2) }], function ([x, y]) {
                this.refX = x, this.refY = y;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    add(shape) {
        this.children.push(shape);
        return this;
    }

    draw(ctx) {
        let t = typeof this.at === 'number' ? this.at : 0;
        for (var i = 0; i < this.children.length; i++) {
            super.draw(ctx);

            //Translate and scale
            var scaleX = this.width / this.originalWidth;
            var scaleY = this.height / this.originalHeight;
            var scaleTranslate = [-(this.refX * (scaleX - 1)), -(this.refY * (scaleY - 1))];
            ctx.translate(this.x, this.y);
            ctx.translate(scaleTranslate[0], scaleTranslate[1]);
            ctx.scale(scaleX, scaleY);

            //Call the child's draw function
            this.children[i].at(t).draw(ctx);

            //Undo transformations
            ctx.scale(1 / scaleX, 1 / scaleY);
            ctx.translate(-scaleTranslate[0], -scaleTranslate[1]);
            ctx.translate(-this.x, -this.y);
        }
        return this;
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            ...super.toJson(false, fps),
            x: this.x,
            y: this.y,
            originalWidth: this.originalWidth,
            originalHeight: this.originalHeight,
            width: this.width,
            height: this.height,
            refX: this.refX,
            refY: this.refY,
            children: []
        };
        for (var i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            o.children.push({
                isBuiltin: isBuiltin(child),
                name: child.shapeName,
                data: this.children[i].toJson(false, fps)
            });
        }
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}
//List of shapes
const otherShapesList = [Shape, Circle, NumberLine, Path, Polygon, Rectangle];
const shapesList = [...otherShapesList, Group];

//Check if a shape is builtin
//This is because requiring ./shapes.js will cause circular dependencies
const isBuiltin = a => {
    for (let shape of shapesList) {
        if (Object.getPrototypeOf(a) === shape.prototype) {
            return true;
        }
    }
    return false;
};

for (let { shapeName, jsonSchema } of otherShapesList) {
    shapeNames.push(shapeName);
    shapeDataSchemas.push({
        if: {
            properties: { name: { const: shapeName } }
        },
        then: {
            properties: { data: jsonSchema }
        }
    });
}
setRef(groupRefKey, Group.jsonSchema);

//Quick way of getting shapes

//List of shapes
const list = [Shape, Rectangle, Group, Circle, Polygon, NumberLine, Path];

//Check if a shape is builtin or not
const isBuiltin$1 = shape => {
    for (var builtinShape of list) {
        if (Object.getPrototypeOf(shape) === builtinShape.prototype) {
            return true;
        }
    }
    return false;
};

//Get a shape from json
const fromJson = typedFunction([
    {
        name: "name",
        type: Types.STRING
    },
    {
        name: "data",
        type: Types.ANY
    },
    {
        name: "parse",
        type: Types.BOOLEAN,
        optional: true
    },
    {
        name: "throwErrors",
        type: Types.BOOLEAN,
        optional: true
    },
    {
        name: "csMappings",
        type: instanceOf(Map),
        optional: true
    },
    {
        name: "caMappings",
        type: instanceOf(Map),
        optional: true
    }
], function (name, json, parse = true, throwErrors = false, csMappings = new Map(), caMappings = new Map()) {
    if (typeof json === 'string' && parse) {
        try {
            json = JSON.parse(json);
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    }
    else if (parse) {
        throw new TypeError("Cannot parse non string json.");
    }
    try {
        for (var shape of list) {
            if (name === shape.shapeName) {
                switch (name) {
                    case Group.shapeName:
                        return shape.fromJson(json, false, true, caMappings, csMappings);
                    default:
                        return shape.fromJson(json, false, true, caMappings);
                }
            }
        }
        throw new TypeError(`Unknown shape: ${name}.`);
    }
    catch (e) {
        if (throwErrors) {
            throw e;
        }
        else {
            return false;
        }
    }
});

//Zero pad a number to the left
const zeroPad = (n, length) => "0".repeat(length - n.toString().length) + n.toString();

//Create captions and generate .vtt files

//Get a formatted time
function formatTime(s) {
    let ms = Math.floor(s * 1000 % 1000);
    s = Math.floor(s);
    let m = Math.floor(s / 60);
    s %= 60;
    let h = Math.floor(m / 60);
    m %= 60;
    return `${zeroPad(h, 2)}:${zeroPad(m, 2)}:${zeroPad(s, 2)}.${zeroPad(ms, 3)}`;
}

//All times must be less than this time
const tooLargeTime =
    60 * //1 Minute
    60 * //1 Hour
    100; //100 Hours

//Caption class
class Caption {
    static vttHeader = 'WEBVTT\n';

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true }
    ], function (json, parse = true, throwErrors = false) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let caption = new Caption();
            for (let { start, end, text } of json) {
                caption.add(start, end, text);
            }
            return caption;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor() {
        this.texts = [];
    }

    add(start, end, text) {
        if (typeof start === 'number' && typeof end === 'number' && start < end && typeof text === 'string') {
            this.texts.push({
                start,
                end,
                text
            });
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
        return this;
    }

    textsAt(time){
        if(typeof time !== 'number' || time < 0){
            throw new TypeError("Time must be a non negative number.");
        }
        let texts = [];
        for(let text of this.texts){
            if(text.start <= time && time < text.end){
                texts.push(text.text);
            }
        }
        return texts;
    }

    toVtt(includeHeader = true, offset = 0) {
        if (typeof includeHeader === 'boolean' && typeof offset === 'number') {
            let vtt = includeHeader ? Caption.vttHeader : '';
            for (let { start, end, text } of this.texts) {
                start += offset;
                end += offset;

                if (start < 0) {
                    throw new TypeError("Out of range - start value is less than 0.");
                }
                if (start >= tooLargeTime) {
                    throw new TypeError("Out of range - start value is >= 100 hours.");
                }
                if (end < 0) {
                    throw new TypeError("Out of range - end value is less than 0.");
                }
                if (end >= tooLargeTime) {
                    throw new TypeError("Out of range - end value is >= 100 hours.");
                }

                vtt += `\n\n${formatTime(start)} --> ${formatTime(end)}\n${text}`;
            }
            return vtt;
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
    }

    toJson(stringify = true) {
        if (typeof stringify !== 'boolean') {
            throw new TypeError("stringify must be a boolean.");
        }
        let texts = [];
        for (let text of this.texts) {
            texts.push(text);
        }
        if (stringify) {
            return JSON.stringify(texts);
        }
        else {
            return texts;
        }
    }
}

//Manage a scene and add shapes

//Config
const defaultDuration = 5;

//Add interface
const addInterface = new Interface(false)
    .optional("startTime", Types.NON_NEGATIVE_NUMBER)
    .optional("duration", Types.POSITIVE_NUMBER)
    .optional("layer", Types.NON_NEGATIVE_INTEGER)
    .toType();

//Scene class
class Scene {
    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "csMappings", type: instanceOf(Map), optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, csMappings = new Map(), caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            if (typeof json === 'object') {
                var { backgroundColor, camera, drawables, captions } = json;
                var scene = new Scene()
                    .setBackgroundColor(backgroundColor)
                    .setCamera(Camera.fromJson(camera, false, true));
                if (drawables instanceof Array) {
                    for (var i = 0; i < drawables.length; i++) {
                        let { startTime, endTime, layer, shape: { isBuiltin, name, data } } = drawables[i];
                        if (isBuiltin) {
                            scene.add(startTime, endTime - startTime, layer, fromJson(name, data, false, true, csMappings, caMappings));
                        }
                        else if (csMappings.has(name)) {
                            scene.add(startTime, endTime - startTime, layer, csMappings.get(name)(data, false, true, csMappings, caMappings));
                        }
                        else {
                            throw new TypeError(`Unmapped custom shape name: ${name}.`);
                        }
                    }
                }
                else {
                    throw new TypeError("scene.drawables is not an array.");
                }
                for (let id in captions) {
                    scene.add(id, Caption.fromJson(captions[id], false, true));
                }
                return scene;
            }
            else {
                throw new TypeError("video is not an object.");
            }
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor() {
        typify(this, {
            backgroundColor: {
                type: colorType,
                initial: tinyColor("white"),
                setter: function (v, set) {
                    if (typeof v === 'object') {
                        set(tinyColor(Object.assign(this._backgroundColor.toRgb(), v)));
                    }
                    else {
                        set(tinyColor(v));
                    }
                },
                getter: function () {
                    var rgb = this._backgroundColor.toRgb();
                    rgb.hexString = this._backgroundColor.toHexString();
                    return rgb;
                }
            }
        });
        this.drawables = [];
        this._camera = new Camera();
        this._duration = 0;
        this.autoDuration = 0;
        this.captions = new Map();
    }

    set camera(camera) {
        return typedFunction([{ name: "camera", type: cameraInterface, optional: false }], function (camera) {
            this._camera = camera;
            return this;
        }).call(this, camera);
    }
    get camera() {
        return this._camera;
    }

    set duration(duration) {
        return typedFunction([{ name: "duration", type: Types.POSITIVE_NUMBER }], function (duration) {
            this._duration = duration;
            return this;
        }).call(this, duration);
    }
    get duration() {
        var duration = this._duration || this.autoDuration;
        return duration !== Infinity ? duration : defaultDuration;
    }

    add() {
        var drawable = {
            startTime: 0,
            endTime: Infinity,
            layer: 0
        };

        const addShape = () => {
            this.autoDuration = Math.max(this.autoDuration, drawable.endTime);
            this.drawables.push(drawable);
        };

        const addCaption = (id, caption) => {
            this.captions.set(id, caption);
        };

        new Overloader()
            //Add Shape overloads
            .overload([
                { type: instanceOf(Shape) }
            ], function (shape) {
                drawable.shape = shape;
                addShape();
            })
            .overload([
                { type: Types.NON_NEGATIVE_NUMBER },
                { type: instanceOf(Shape) }
            ], function (startTime, shape) {
                drawable.startTime = startTime;
                drawable.shape = shape;
                addShape();
            })
            .overload([
                { type: Types.NON_NEGATIVE_NUMBER },
                { type: Types.POSITIVE_NUMBER },
                { type: instanceOf(Shape) }
            ], function (startTime, duration, shape) {
                drawable.startTime = startTime;
                drawable.endTime = startTime + duration;
                drawable.shape = shape;
                addShape();
            })
            .overload([
                { type: Types.NON_NEGATIVE_NUMBER },
                { type: Types.POSITIVE_NUMBER },
                { type: Types.NON_NEGATIVE_INTEGER },
                { type: instanceOf(Shape) }
            ], function (startTime, duration, layer, shape) {
                drawable.startTime = startTime;
                drawable.endTime = startTime + duration;
                drawable.layer = layer;
                drawable.shape = shape;
                addShape();
            })
            .overload([
                { type: addInterface },
                { type: instanceOf(Shape) }
            ], function ({ startTime, duration, layer }, shape) {
                drawable.startTime = startTime || 0;
                drawable.endTime = drawable.startTime + (duration || Infinity);
                drawable.layer = layer || 0;
                drawable.shape = shape;
                addShape();
            })

            //Add caption overloads
            .overload([
                { type: instanceOf(Caption) }
            ], function (caption) {
                var n = 0;
                var id;
                do {
                    id = `Caption Track ${n}`;
                    n++;
                }
                while (this.captions.has(id));
                addCaption(id, caption);
            })
            .overload([
                { type: Types.STRING },
                { type: instanceOf(Caption) }
            ], addCaption)
            .overloader.call(this, ...arguments);
        return this;
    };

    setBackgroundColor(color) {
        this.backgroundColor = color;
        return this;
    }

    setCamera(camera) {
        this.camera = camera;
        return this;
    };

    render(at, { width, height }, ctx = createCanvas(width, height).getContext('2d')) {
        if (!(0 < at < this.duration)) {
            throw new TypeError("At is out of range.");
        }
        if (!(width > 0 && width < Infinity) || width & 1) {
            throw new TypeError("Invalid width.");
        }
        if (!(height > 0 && height < Infinity) || height & 1) {
            throw new TypeError("Invalid width.");
        }
        if(Types.CANVAS_CTX(ctx)){
            throw new TypeError("Invalid Canvas Ctx.");
        }

        //Draw the background
        ctx.fillStyle = this.backgroundColor.hexString;
        ctx.fillRect(0, 0, width, height);

        //Set the default settings
        ctx.fillStyle = "black";
        ctx.strokeStyle = "none";
        ctx.lineWidth = 1;

        //Set the necessary transforms
        var { scaleX, scaleY, refX, refY, x, y } = this.camera.at(at);
        //Translate relative to camera position
        ctx.translate(-x, -y);
        //Translate to make scale relative to ref
        ctx.translate(-(refX * (scaleX - 1)), -(refY * (scaleY - 1)));
        //Scale
        ctx.scale(scaleX, scaleY);

        //Filter only shapes to draw
        const shapeIsInFrame = ({ startTime, endTime }) => at >= startTime && at < endTime;

        //Sort by layer
        const sortLayer = (a, b) => a.layer - b.layer;

        //Map the shapes to their hashes
        let drawables = this.drawables.filter(shapeIsInFrame).sort(sortLayer);

        //Draw filtered and sorted drawables
        for (let i = 0; i < drawables.length; i++) {
            drawables[i].shape.at(at).draw(ctx);
        }

        return ctx;
    }

    setDuration(duration) {
        this.duration = duration;
        return this;
    };

    toJson(stringify = true, fps = 60) {
        let o = {
            backgroundColor: this.backgroundColor.hexString,
            drawables: [],
            captions: {},
            camera: this.camera.toJson(false)
        };
        for (var i = 0; i < this.drawables.length; i++) {
            let { startTime, endTime, layer, shape } = this.drawables[i];
            o.drawables.push({
                startTime,
                endTime,
                layer,
                shape: {
                    isBuiltin: isBuiltin$1(shape),
                    name: shape.shapeName,
                    data: shape.toJson(false, fps)
                }
            });
        }
        for (let [id, caption] of this.captions) {
            o.captions[id] = caption.toJson(false);
        }
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Render the final video

//Video options
const optionsInterface = new Interface(false)
    .required("width", sizeType)
    .required("height", sizeType)
    .required("fps", Types.POSITIVE_NUMBER)
    .toType();
const shortOptionsInterface = new Interface(false)
    .required("w", sizeType)
    .required("h", sizeType)
    .required("fps", Types.POSITIVE_NUMBER)
    .toType();

const squashedOptionsInterface = new Interface(false)
    .required("size", regularSizeInterface)
    .required("fps", Types.POSITIVE_NUMBER)
    .toType();
const shortSquashedOptionsInterface = new Interface(false)
    .required("size", shortSizeInterface)
    .required("fps", Types.POSITIVE_NUMBER)
    .toType();

//Video Player, for basic canvas drawing. No fs operations.
class VideoPlayer {
    constructor(video) {
        this.video = video;
        this._at = 0;
        this.timeInScene = 0;
        this.currentScene = 0;
        this.currentSceneStartTime = 0;
        this.currentSceneDuration = this.video.scenes[0].duration;
    }

    set at(time) {
        this.seek(time);
    }
    get at() {
        return this._at;
    }

    get duration() {
        return this.video.duration;
    }

    seek(time) {
        if (time < 0 && time >= this.duration) {
            throw new RangeError("Time is out of bounds. Time must be >= 0 and < duration.");
        }
        this.currentScene = 0;
        this.currentSceneStartTime = 0;
        this.currentSceneDuration = this.video.scenes[0].duration;
        while (this.currentSceneStartTime + this.currentSceneDuration < time) {
            this.currentScene++;
            this.currentSceneStartTime += this.currentSceneDuration;
            this.currentSceneDuration = this.video.scenes[this.currentScene].duration;
        }
        this.timeInScene = time - this.currentSceneStartTime;
        this._at = time;

        return this;
    }

    forward(time) {
        if (time <= 0) {
            throw new RangeError("time must be greater than 0, because you are moving forward.");
        }
        if (this.at + time >= this.duration) {
            throw new RangeError("Cannot go forward past end of video.");
        }
        var timeLeftInScene = this.currentSceneDuration - this.timeInScene;
        while (timeLeftInScene <= time) {
            this.currentSceneStartTime += this.currentSceneDuration;
            this.currentScene++;
            this._at += timeLeftInScene;
            time -= timeLeftInScene;
            this.timeInScene = 0;
            this.currentSceneDuration = this.video.scenes[this.currentScene].duration;
            timeLeftInScene = this.currentSceneDuration;
        }
        this.timeInScene += time;
        this._at += time;

        return this;
    }

    draw(ctx = createCanvas(this.video.width, this.video.height).getContext('2d')) {
        return typedFunction([{ name: "ctx", type: Types.CANVAS_CTX }], ctx => {
            return this.video.scenes[this.currentScene].render(this.timeInScene, this.video, ctx);
        })(ctx);
    }

    getCaptions(id = "Caption Track 0"){
        let caption = this.video.scenes[this.currentScene].captions.get(id);
        if(caption){
            return caption.textsAt(this.at);
        }
        else {
            return [];
        }
    }
}

//Video class
class Video extends EventEmitter {
    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "csMappings", type: instanceOf(Map), optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, csMappings = new Map(), caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            if (typeof json === 'object') {
                const propertiesToAdd = new Set()
                    .add("width")
                    .add("height")
                    .add("fps")
                    .add("scenes");
                var { width, height, fps, scenes } = json;
                for (var k in json) {
                    if (!propertiesToAdd.has(k)) {
                        throw new TypeError(`Unknown property: ${k}.`);
                    }
                }
                var video = new Video(width, height, fps);
                if (scenes instanceof Array) {
                    for (var i = 0; i < scenes.length; i++) {
                        video.add(Scene.fromJson(scenes[i], false, true, csMappings, caMappings));
                    }
                }
                else {
                    throw new TypeError("video.scenes is not an array.");
                }
                return video;
            }
            else {
                throw new TypeError("video is not an object.");
            }
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor() {
        super();
        typify(this, {
            width: sizeType,
            height: sizeType,
            fps: Types.POSITIVE_NUMBER,
            spf: {
                type: Types.POSITIVE_NUMBER,
                setter: function (v) {
                    this.fps = 1 / v;
                },
                getter: function () {
                    return 1 / this.fps;
                }
            }
        });
        new Overloader()
            .overload([{ type: sizeType }, { type: sizeType }, { type: Types.POSITIVE_NUMBER }], function (width, height, fps) {
                this.width = width, this.height = height, this.fps = fps;
            })
            .overload([{ type: regularSizeInterface }, { type: Types.POSITIVE_NUMBER }], function ({ width, height }, fps) {
                this.width = width, this.height = height, this.fps = fps;
            })
            .overload([{ type: shortSizeInterface }, { type: Types.POSITIVE_NUMBER }], function ({ w, h }, fps) {
                this.width = w, this.height = h, this.fps = fps;
            })
            .overload([{ type: optionsInterface }], function ({ width, height, fps }) {
                this.width = width, this.height = height, this.fps = fps;
            })
            .overload([{ type: shortOptionsInterface }], function ({ w, h, fps }) {
                this.width = w, this.height = h, this.fps = fps;
            })
            .overload([{ type: squashedOptionsInterface }], function ({ size: { width, height }, fps }) {
                this.width = width, this.height = height, this.fps = fps;
            })
            .overload([{ type: shortSquashedOptionsInterface }], function ({ size: { w, h }, fps }) {
                this.width = w, this.height = h, this.fps = fps;
            })
            .overloader.call(this, ...arguments);
        this.scenes = [];
    };

    get duration() {
        var d = 0;
        for (var i = 0; i < this.scenes.length; i++) {
            d += this.scenes[i].duration;
        }
        return d;
    }

    add() {
        typedFunction([{ name: "scene", type: instanceOf(Scene) }], function (scene) {
            this.scenes.push(scene);
        }).call(this, ...arguments);
        return this;
    }

    setWidth(width) {
        this.width = width;
        return this;
    }
    setHeight(height) {
        this.height = height;
        return this;
    }
    setSize() {
        new Overloader()
            .overload([{ type: sizeType }, { type: sizeType }], function (width, height) {
                this.width = width, this.height = height;
            })
            .overload([{ type: regularSizeInterface }], function ({ width, height }) {
                this.width = width, this.height = height;
            })
            .overload([{ type: shortSizeInterface }], function ({ w, h }) {
                this.width = w, this.height = h;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    setFps(fps) {
        this.fps = fps;
        return this;
    }
    setSpf(spf) {
        this.spf = spf;
        return this;
    }

    toJson(stringify = true, fps = this.fps) {
        var o = {
            width: this.width,
            height: this.height,
            fps: this.fps,
            scenes: []
        };
        for (var i = 0; i < this.scenes.length; i++) {
            o.scenes.push(this.scenes[i].toJson(false, fps));
        }

        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be boolean.");
        }
    }

    createPlayer() {
        return new VideoPlayer(this);
    }
}

//Easily assign default properties to objects
//For example
/* Default Object
{
    name: "New Thing",
    description: "A detailed description."
} */
/* Given Object
{
    name: "Hi"
} */
/* Output Object
{
    name: "Hi",
    description: "A detailed description."
} */

//Declare and export function
const defaultify = (properties, defaultProperties) => {
    const anyDefault = (g, d) => {
        if (typeof d === 'object') {
            return objectDefault(g, d);
        }
        else if (typeof g === 'undefined') {
            return d;
        }
        else {
            return g;
        }
    };
    const objectDefault = (g, d) => {
        if (typeof g === 'object') {
            var o = {};
            for (var k in d) {
                o[k] = anyDefault(g[k], d[k]);
            }
            return o;
        }
        else {
            return d;
        }
    };
    return anyDefault(properties, defaultProperties);
};

//Export enums
//The export process is split into stages.
//Each stage has some tasks that it depends on.
//After those tasks are done, it starts the tasks that depend on the stage to be done.

//Visualization

// START                 CREATE_FILES                     GENERATE_VIDEO       DELETE_TEMPORARY      FINISH
// | --> CHECK_TEMP_PATH |                                |                    |                     |
//                       | --> DELETE_EXTRA_FRAMES        |                    |                     |
//                       | --> RENDER_NEW_FRAMES          |                    |                     |
//                       | --> GENERATE_EMBEDDED_CAPTIONS |                    |                     |
//                                                        | --> GENERATE_VIDEO |                     |
//                                                                             | --> DELETE_FRAMES   |
//                                                                             | --> DELETE_CAPTIONS |
//                       | --> GENERATE_SEPARATE_CAPTIONS                                            |

//Export stages enum
const ExportStages = {
    START: "START",
    CREATE_FILES: "CREATE_FILES",
    GENERATE_VIDEO: "GENERATE_VIDEO",
    DELETE_TEMPORARY: "DELETE_FRAMES",
    FINISH: "FINISH"
};

//Export tasks enum
const ExportTasks = {
    CHECK_TEMP_PATH: {
        name: "CHECK_TEMP_PATH",
        start: ExportStages.START,
        end: ExportStages.CREATE_FILES
    },
    DELETE_EXTRA_FRAMES: {
        name: "DELETE_EXTRA_FRAMES",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.GENERATE_VIDEO
    },
    RENDER_NEW_FRAMES: {
        name: "RENDER_NEW_FRAMES",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.GENERATE_VIDEO
    },
    GENERATE_SEPARATE_CAPTIONS: {
        name: "GENERATE_SEPARATE_CAPTIONS",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.FINISH
    },
    GENERATE_EMBEDDED_CAPTIONS: {
        name: "GENERATE_EMBEDDED_CAPTIONS",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.GENERATE_VIDEO
    },
    GENERATE_VIDEO: {
        name: "GENERATE_VIDEO",
        start: ExportStages.GENERATE_VIDEO,
        end: ExportStages.DELETE_TEMPORARY
    },
    DELETE_FRAMES: {
        name: "DELETE_FRAMES",
        start: ExportStages.DELETE_TEMPORARY,
        end: ExportStages.FINISH
    },
    DELETE_CAPTIONS: {
        name: "DELETE_CAPTIONS",
        start: ExportStages.DELETE_TEMPORARY,
        end: ExportStages.FINISH
    }
};

//Render the final video

//Image regex
const imageRegex = /canvideo \d+\.png/i;
//Make sure directory exists
function directoryExists(path) {
    return new Promise((resolve, reject) => {
        //Check if directory exists
        if (fs__default.existsSync(path)) {
            fs__default.lstat(path, (err, stats) => {
                if (!err) {
                    if (stats.isDirectory()) {
                        resolve(path);
                    }
                    else {
                        reject(`directory: ${path}, is not a directory.`);
                    }
                }
                else {
                    reject(`Error checking if directory exists: ${err}`);
                }
            });
        }
        else {
            reject(`directory: ${path}, does not exist.`);
        }
    });
}

//Set the global tempPath
const setTempPath = (path) => exports.tempPath = directoryExists(path);

//Check that ffmpeg path is good
var ffmpegPathStatus;
const checkFfmpegPath = async () => new Promise((resolve, reject) => {
    var command = child_process.exec(`${ffmpegPath} -version`);
    command.once("exit", code => {
        if (code === 0) {
            ffmpegPathStatus = true;
            resolve();
        }
        else {
            ffmpegPathStatus = false;
            reject(`Check command failed: ${ffmpegPath} -version.`);
        }
    });
});

//Set and get ffmpeg path
var ffmpegPath = "ffmpeg";
const setFfmpegPath = (path) => {
    if (path !== ffmpegPath) {
        ffmpegPath = path;
        ffmpegPathStatus = undefined;
    }
};
const getFfmpegPath = () => ffmpegPath;

//Output interface
const outputInterface = new Interface(false)
    .required("video", Types.STRING)
    .optional("captions", either(Types.STRING, instanceOf(Map)))
    .optional("embeddedCaptions", either(Types.BOOLEAN, instanceOf(Set)))
    .toType();

//Output type
const outputType = either(Types.STRING, outputInterface);

//Export options interface
const exportOptionsInterface = new Interface(false)
    .optional("keepImages", Types.BOOLEAN)
    .optional("maxStreams", Types.POSITIVE_INTEGER)
    .toType();

//Video class
class Video$1 extends Video {
    constructor() {
        super(...arguments);
        typify(this, {
            tempPath: {
                type: Types.STRING,
                setter(v, set) {
                    set(directoryExists(v));
                }
            }
        });
    }

    setTempPath(path) {
        this.tempPath = path;
        return this;
    }

    export() {
        if (this.duration === 0) {
            throw new Error("video duration must be greater than 0.");
        }

        const start = (output, { keepImages, maxStreams }) => {
            var outputVideo, outputCaptions, embeddedCaptions;
            if (typeof output === 'string') {
                outputVideo = output;
                outputCaptions = new Map();
                embeddedCaptions = new Set();
            }
            else {
                outputVideo = output.video;
                outputCaptions = output.captions || new Map();
                if (typeof outputCaptions === 'string') {
                    let outputCaptionsDir = outputCaptions;
                    outputCaptions = new Map();
                    for (let { captions } of this.scenes) {
                        for (let id of captions.keys()) {
                            if (!outputCaptions.has(id)) {
                                outputCaptions.set(id, path__default.resolve(path__default.join(outputCaptionsDir, id + ".vtt")));
                            }
                        }
                    }
                }
                embeddedCaptions = output.embeddedCaptions || false;
            }

            var tempPathToUse = this.tempPath || exports.tempPath;
            if (!tempPathToUse) {
                throw new ReferenceError("tempPath must be set before exporting.");
            }

            var frameCount = Math.ceil(this.duration * this.fps);

            var emitter = new EventEmitter();

            emitter.currentStage = ExportStages.START;
            emitter.currentTasks = new Set();

            emitter.checkTempPath = new EventEmitter();
            emitter.deleteExtraFrames = new EventEmitter();
            emitter.renderNewFrames = new EventEmitter();
            emitter.generateEmbeddedCaptions = new EventEmitter();
            emitter.generateVideo = new EventEmitter();
            emitter.deleteFrames = new EventEmitter();
            emitter.deleteCaptions = new EventEmitter();
            emitter.generateSeparateCaptions = new EventEmitter();

            emitter.totalFrames = frameCount;
            emitter.video = this;

            const getTaskEmitter = task => {
                if (emitter.hasOwnProperty(task)) {
                    let taskEmitter = emitter[task];
                    return (name, ...params) => {
                        taskEmitter.emit(name);
                        emitter.emit(`${task}_${name}`, ...params);
                        this.emit(`${task}_${name}`, ...params, emitter);
                    };
                }
                else {
                    throw new ReferenceError(`emitter doesn't have task: ${task}.`);
                }
            };

            const checkTempPath = async () => {
                let emit = getTaskEmitter("checkTempPath");
                emit("start");
                tempPathToUse = await tempPathToUse;
                emit("finish");
            };

            const deleteExtraFrames = async () => {
                let emit = getTaskEmitter("deleteExtraFrames");
                emit("start");

                var files = await fs.promises.readdir(tempPathToUse);
                emit("readDir");

                var deletePromises = [];
                for (var i = 0; i < files.length; i++) {
                    let file = files[i];
                    if (imageRegex.test(file)) {
                        //canvideo <
                        //012345678<
                        let frameNumber = parseInt(file.substring(9, file.indexOf('.')));
                        if (frameNumber >= frameCount) {
                            emit("deleteStart", frameNumber);
                            deletePromises.push(fs.promises.unlink(path__default.join(tempPathToUse, file))
                                .then(() => {
                                    emit("deleteFinish", frameNumber);
                                })
                            );
                        }
                    }
                }
                return Promise.all(deletePromises).then(() => {
                    emit("finish");
                });
            };

            const embeddedCaptionsWrites = new Map();
            const embeddedCaptionFiles = new Set();
            const tempCaptionFiles = new Map();
            const generateEmbeddedCaptions = async () => {
                let emit = getTaskEmitter("generateEmbeddedCaptions");
                emit("start");
                if (embeddedCaptions) {
                    let captionsStrings = new Map();
                    let currentTime = 0;
                    for (let { captions, duration } of this.scenes) {
                        for (let [id, caption] of captions) {
                            if (embeddedCaptions === true || embeddedCaptions.has(id)) {
                                if (captionsStrings.has(id)) {
                                    captionsStrings.set(id, captionsStrings.get(id) + caption.toVtt(false, currentTime));
                                }
                                else {
                                    captionsStrings.set(id, caption.toVtt(true, currentTime));
                                }
                            }
                        }
                        currentTime += duration;
                    }                    //Check that there are no caption ids that don't exist
                    if (typeof embeddedCaptions === 'object') {
                        for (let id of embeddedCaptions.keys()) {
                            if (!captionsStrings.has(id)) {
                                throw new ReferenceError(`No captions with id: ${id}, found.`);
                            }
                        }
                    }
                    let writePromises = [];
                    for (let [id, captionString] of captionsStrings) {
                        let captionOutput;
                        if (outputCaptions.has(id)) {
                            captionOutput = outputCaptions.get(id);
                        }
                        else {
                            captionOutput = path__default.resolve(path__default.join(tempPathToUse, `./canvideo ${id}.vtt`));
                            tempCaptionFiles.set(id, captionOutput);
                        }
                        emit("writeStart", id);
                        var captionsWrite = fs.promises.writeFile(captionOutput, captionString).then(() => {
                            emit("writeFinish", id);
                        });
                        embeddedCaptionsWrites.set(id, captionsWrite);
                        writePromises.push(captionsWrite);
                        embeddedCaptionFiles.add(captionOutput);
                    }
                    await Promise.all(writePromises);
                }
                emit("finish");
            };

            const generateSeparateCaptions = async () => {
                let emit = getTaskEmitter("generateSeparateCaptions");
                emit("start");
                let writePromises = [];
                let captionsToWrite = new Map();
                for (let [id, captionsPath] of outputCaptions) {
                    if (path__default.extname(captionsPath) !== ".vtt") {
                        throw new URIError("Unrecognized caption file format. Currently, only .vtt is supported.");
                    }
                    if (embeddedCaptionsWrites.has(id)) {
                        writePromises.push(embeddedCaptionsWrites.get(id));
                    }
                    else {
                        captionsToWrite.set(id, captionsPath);
                    }
                }                let captionsStrings = new Map();
                let currentTime = 0;
                for (let { captions, duration } of this.scenes) {
                    for (let [id, caption] of captions) {
                        if (captionsToWrite.has(id)) {
                            if (captionsStrings.has(id)) {
                                captionsStrings.set(id, captionsStrings.get(id) + caption.toVtt(false, currentTime));
                            }
                            else {
                                captionsStrings.set(id, caption.toVtt(true, currentTime));
                            }
                        }
                    }
                    currentTime += duration;
                }                for (let [id, captionString] of captionsStrings) {
                    let captionOutput = captionsToWrite.get(id);
                    var captionsWrite = fs.promises.writeFile(captionOutput, captionString).then(() => {
                        emit("writeFinish", id);
                    });
                    emit("writeStart", id);
                    writePromises.push(captionsWrite);
                }
                await Promise.all(writePromises);
                emit("finish");
            };

            var framePaths = [];
            const renderNewFrames = async () => {
                let emit = getTaskEmitter("renderNewFrames");
                emit("start");

                let writePromises = 0;
                let writeEmitter = new EventEmitter();
                let startedAll = false;

                const addWrite = (write) => {
                    writePromises++;
                    write.then(() => {
                        if (--writePromises < maxStreams) {
                            writeEmitter.emit("ready");
                            if (startedAll && writePromises === 0) {
                                writeEmitter.emit("done");
                            }
                        }
                    });
                };

                const nextTurn = async () => {
                    if (writePromises < maxStreams) {
                        return Promise.resolve();
                    }
                    else {
                        return once(writeEmitter, "ready");
                    }
                };

                let player = this.createPlayer();
                for (let i = 0; i < this.duration * this.fps; i++) {
                    let currentFrame = i;

                    await nextTurn();

                    emit("renderStart", currentFrame);
                    let canvas = player.draw().canvas;
                    addWrite(
                        new Promise((resolve, reject) => {
                            let framePath = path__default.join(tempPathToUse, `./canvideo ${currentFrame}.png`);
                            framePaths.push(framePath);

                            canvas.createPNGStream()
                                .once('end', resolve)
                                .pipe(fs__default.createWriteStream(framePath));
                        })
                            .then(() => {
                                emit("renderFinish", currentFrame);
                            })
                    );
                }
                startedAll = true;

                await once(writeEmitter, "done");
                emit("finish");
            };

            const generateVideo = async () => {
                let emit = getTaskEmitter("generateVideo");
                emit("start");
                emit("checkFfmpegPathStart");
                if (ffmpegPathStatus === false) {
                    throw new ReferenceError("Bad ffmpeg path.");
                }
                else if (ffmpegPathStatus === undefined) {
                    await checkFfmpegPath().catch(() => {
                        throw new ReferenceError("Bad ffmpeg path.");
                    });
                }
                emit("checkFfmpegPathFinish");
                emit("generateStart");
                //Check that outputVideo is .mp4
                checkVideoPath(outputVideo);
                //Command to generate video
                let ffmpegCommand = `${ffmpegPath}`;
                //Add fps
                ffmpegCommand += ` -r ${this.fps}`;
                //Add frame input.
                ffmpegCommand += ` -i "${path__default.join(tempPathToUse, "./canvideo %01d.png")}"`;
                //Add captions.
                for (let captionFile of embeddedCaptionFiles) {
                    ffmpegCommand += ` -i "${captionFile}"`;
                }
                //Add mappings
                ffmpegCommand += " -map 0:v";
                for (var i = 1; i <= embeddedCaptionFiles.size; i++) {
                    ffmpegCommand += ` -map ${i}:s`;
                }
                //Add more options
                ffmpegCommand += " -c:s mov_text -an -vcodec libx264 -pix_fmt yuv420p -progress pipe:1 -y";
                //Add output path
                ffmpegCommand += ` "${outputVideo}"`;
                //Await a promise because of special async logic.
                await new Promise((resolve, reject) => {
                    let command = child_process.exec(ffmpegCommand);
                    command.stdout.on('data', data => {
                        //This is the progress chunk
                        //Get the frame, total_size, and progress
                        let frames = parseInt(/(?<=frame=)\S.*/.exec(data)[0]);
                        let size = parseInt(/(?<=total_size=)\S.*/.exec(data)[0]);
                        let finished = /(?<=progress=)\S.*/.exec(data)[0] === 'end' ? true : false;
                        emit("generateProgress", {
                            frames,
                            totalFrames: frameCount,
                            size,
                            progress: frames / frameCount,
                            finished
                        });
                    });
                    command.once('exit', code => {
                        if (code === 0) {
                            emit("generateFinish");
                            resolve();
                        }
                        else {
                            reject("ffmpeg process exited with non 0 code.");
                        }
                    });
                });
                emit("finish");
            };

            const deleteFrames = async () => {
                let emit = getTaskEmitter("deleteFrames");
                emit("start");
                if (!keepImages) {
                    var deletePromises = [];
                    for (var i = 0; i < framePaths.length; i++) {
                        let frameNumber = i;
                        emit("deleteStart", frameNumber);
                        deletePromises.push(fs.promises.unlink(framePaths[frameNumber])
                            .then(() => {
                                emit("deleteFinish", frameNumber);
                            })
                        );
                    }
                    await Promise.all(deletePromises);
                }
                emit("finish");
            };

            const deleteCaptions = async () => {
                let emit = getTaskEmitter("deleteCaptions");
                emit("start");
                let deletePromises = [];
                for (let [id, tempCaptionFile] of tempCaptionFiles) {
                    emit("deleteStart", id);
                    deletePromises.push(fs.promises.unlink(tempCaptionFile).then(() => {
                        emit("deleteFinish", id);
                    }));
                }
                await Promise.all(deletePromises);
                emit("finish");
            };

            const emit = (name, ...params) => {
                emitter.emit(name, ...params);
                this.emit(name, ...params, emitter);
            };

            const stage = stage => {
                emitter.currentStage = stage;
                emit("stage", stage);
            };

            const taskStart = task => {
                emitter.currentTasks.add(task);
                emit("taskStart", task);
            };

            const taskFinish = task => {
                emitter.currentTasks.delete(task);
                emit("taskFinish", task);
            };

            const startStages = async () => {
                //START
                stage(ExportStages.START);
                //CHECK_TEMP_PATH
                taskStart(ExportTasks.CHECK_TEMP_PATH);
                await checkTempPath();
                taskFinish(ExportTasks.CHECK_TEMP_PATH);

                //CREATE_FILES
                let generateVideoPromises = [];
                let finishPromises = [];
                stage(ExportStages.CREATE_FILES);
                //DELETE_EXTRA_FRAMES
                taskStart(ExportTasks.DELETE_EXTRA_FRAMES);
                generateVideoPromises.push(deleteExtraFrames().then(() => {
                    taskFinish(ExportTasks.DELETE_EXTRA_FRAMES);
                }));
                //RENDER_NEW_FRAMES
                taskStart(ExportTasks.RENDER_NEW_FRAMES);
                generateVideoPromises.push(renderNewFrames().then(() => {
                    taskFinish(ExportTasks.RENDER_NEW_FRAMES);
                }));
                //GENERATE_EMBEDDED_CAPTIONS
                taskStart(ExportTasks.GENERATE_EMBEDDED_CAPTIONS);
                generateVideoPromises.push(generateEmbeddedCaptions().then(() => {
                    taskFinish(ExportTasks.GENERATE_EMBEDDED_CAPTIONS);
                }));
                //GENERATE_SEPARATE_CAPTIONS
                taskStart(ExportTasks.GENERATE_SEPARATE_CAPTIONS);
                finishPromises.push(generateSeparateCaptions().then(() => {
                    taskFinish(ExportTasks.GENERATE_SEPARATE_CAPTIONS);
                }));
                await Promise.all(generateVideoPromises);

                //GENERATE_VIDEO
                stage(ExportStages.GENERATE_VIDEO);
                //GENERATE_VIDEO
                taskStart(ExportTasks.GENERATE_VIDEO);
                await generateVideo();
                taskFinish(ExportTasks.GENERATE_VIDEO);

                //DELETE_TEMPORARY
                stage(ExportStages.DELETE_TEMPORARY);
                //DELETE_FRAMES
                taskStart(ExportTasks.DELETE_FRAMES);
                finishPromises.push(deleteFrames().then(() => {
                    taskFinish(ExportTasks.DELETE_FRAMES);
                }));
                //DELETE_CAPTIONS
                taskStart(ExportTasks.DELETE_CAPTIONS);
                finishPromises.push(deleteCaptions().then(() => {
                    taskFinish(ExportTasks.DELETE_CAPTIONS);
                }));
                await Promise.all(finishPromises);

                //FINISH
                stage(ExportStages.FINISH);
            };

            //Start steps and synchronously return emitter
            setImmediate(() => {
                emit("start");
                startStages()
                    .then(() => {
                        emit("finish");
                    })
                    .catch(err => {
                        emit('error', err);
                    });
            });
            return emitter;
        };

        function checkVideoPath(outputPath) {
            if (path__default.extname(outputPath) !== '.mp4') {
                throw new URIError("Output path must have .mp4 extension.");
            }
        }
        const defaultOptions = {
            keepImages: false,
            maxStreams: 100
        };
        const handleReturning = (outputPath, options, returnPromise) => {
            options = defaultify(options, defaultOptions);
            if (returnPromise) {
                return new Promise((resolve, reject) => {
                    start(outputPath, options)
                        .on("finish", () => {
                            resolve();
                        })
                        .on('error', reject);
                });
            }
            else {
                start(outputPath, options);
                return this;
            }
        };

        const handleCallback = (outputPath, options, callback) => {
            options = defaultify(options, defaultOptions);
            callback(start(outputPath, options));
            return this;
        };

        return new Overloader()
            .overload([{ type: outputType }, { type: Types.BOOLEAN, optional: true }], function (outputPath, returnPromise = false) {
                return handleReturning(outputPath, { keepImages: false }, returnPromise);
            })
            .overload([{ type: outputType }, { type: exportOptionsInterface }, { type: Types.BOOLEAN, optional: true }], function (outputPath, options, returnPromise = false) {
                return handleReturning(outputPath, options, returnPromise);
            })
            .overload([{ type: outputType }, { type: Types.FUNCTION }], function (outputPath, callback) {
                return handleCallback(outputPath, { keepImages: false }, callback);
            })
            .overload([{ type: outputType }, { type: exportOptionsInterface }, { type: Types.FUNCTION }], function (outputPath, options, callback) {
                return handleCallback(outputPath, options, callback);
            })
            .overloader.apply(this, arguments);
    }
}

//File for managing server for web gui.

//Dirname
// file:///
// 01234567
const myDirname = path.dirname((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.js', document.baseURI).href))).substring(8);

//Promise that gets resource paths
const resPaths = (async () => {
    const paperCss = undefined('papercss/dist/paper.min.css');
    const jsonEditor = undefined('jsoneditor');
    const tinyColor = undefined('tinycolor2/dist/tinycolor-min.js');
    const eventEmitter = undefined('eventemitter3/umd/eventemitter3.min.js');
    await Promise.all([paperCss, jsonEditor, tinyColor, eventEmitter]);

    const jsonEditorDist = path.join(path.dirname(await jsonEditor).substring(8), './dist/');

    return {
        paperCss: (await paperCss).substring(8),
        jsonEditor: {
            css: path.join(jsonEditorDist, "./jsoneditor.min.css"),
            js: path.join(jsonEditorDist, "./jsoneditor.min.js"),
            map: path.join(jsonEditorDist, "./jsoneditor.map"),
            svg: path.join(jsonEditorDist, "./img/jsoneditor-icons.svg")
        },
        tinyColor: (await tinyColor).substring(8),
        eventEmitter: (await eventEmitter).substring(8)
        
    };
})();

//Function that returns an express router.
const createRouter = async () => {
    //Wait for resource paths
    const {
        paperCss: paperCssPath,
        jsonEditor: jsonEditorPaths,
        tinyColor: tinyColorPath,
        eventEmitter: eventEmitterPath
    } = await resPaths;

    //Server path
    const serverPath = myDirname;

    //Web path
    const webPath = path.join(myDirname, "../web/");

    //Common path
    const commonPath = path.join(myDirname, "../common/");

    //Create an express router
    let router = express.Router();

    //Testing
    router.get("/module.js", (req, res) => {
        res.sendFile(path.join(serverPath, "./pages/module.js"));
    });

    //Main page
    router.get("/", (req, res) => {
        res.sendFile(path.join(serverPath, "./pages/index/index.html"));
    });

    //Create page
    router.get("/create", (req, res) => {
        res.sendFile(path.join(serverPath, "./pages/create/create.html"));
    });
    router.use("/create", express.static(path.join(serverPath, "./pages/create/")));

    //Paper css
    router.get("/paper.min.css", (req, res) => {
        res.sendFile(paperCssPath);
    });

    //Json editor
    router.get("/json-editor.min.css", (req, res) => {
        res.sendFile(jsonEditorPaths.css);
    });
    router.get("/json-editor.min.js", (req, res) => {
        res.sendFile(jsonEditorPaths.js);
    });
    router.get("/jsoneditor.map", (req, res) => {
        res.sendFile(jsonEditorPaths.map);
    });
    router.get("/img/jsoneditor-icons.svg", (req, res) => {
        res.sendFile(jsonEditorPaths.svg);
    });

    //Tiny Color
    router.get("/tiny-color.min.js", (req, res) => {
        res.sendFile(tinyColorPath);
    });

    //eventemitter3
    router.get("/event-emitter.min.js", (req, res) => {
        res.sendFile(eventEmitterPath);
    });

    //Static directories
    router.use("/common", express.static(webPath));
    router.use("/common", express.static(commonPath));

    router.use("/web", express.static(webPath));
    
    router.use("/static", express.static(path.join(serverPath, "./static")));

    return router;
};

exports.Animation = Animation;
exports.Camera = Camera;
exports.Caption = Caption;
exports.Circle = Circle;
exports.ExportStages = ExportStages;
exports.ExportTasks = ExportTasks;
exports.Group = Group;
exports.NumberLine = NumberLine;
exports.Path = Path;
exports.Polygon = Polygon;
exports.Precomputed = Precomputed;
exports.Rectangle = Rectangle;
exports.Scene = Scene;
exports.Shape = Shape;
exports.Video = Video$1;
exports.checkFfmpegPath = checkFfmpegPath;
exports.createRouter = createRouter;
exports.getFfmpegPath = getFfmpegPath;
exports.setFfmpegPath = setFfmpegPath;
exports.setTempPath = setTempPath;
