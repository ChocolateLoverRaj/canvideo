//Manage animatable properties

//Dependencies
const { Types, typedFunction, keyValueObject, interface, either, Interface, arrayOf } = require("../type");
const { propertiesType, methodsToBindType } = require("./properties-type");

const params = [
    {
        name: "o",
        type: Types.OBJECT
    },
    {
        name: "properties",
        type: propertiesType
    },
    {
        name: "methodsToBind", type: methodsToBindType
    }
]
const animanage = typedFunction(params, function (o, properties, methodsToBind) {
    //List of properties that were explicitly set
    var explicit = new Set();

    //Add properties, getters/setters, and hidden properties.
    var oInterface = new Interface(false);
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
            function(v){
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
        Object.defineProperty(o, k, property);
        oInterface.optional(k, type || Types.ANY);
    }
    oInterface = oInterface.toType();
    //Add the isExplicitlySet function
    Object.defineProperty(o, "isExplicitlySet", {
        enumerable: true,
        configurable: false,
        value: typedFunction([{name: "key", type: Types.STRING}], function(key){
            return explicit.has(key);
        })
    });
    //Add the animate function
    var animations = [];
    Object.defineProperty(o, "animate", {
        enumerable: true,
        configurable: false,
        value: typedFunction([
            { name: "startTime", type: Types.NON_NEGATIVE_NUMBER },
            { name: "duration", type: Types.NON_NEGATIVE_NUMBER },
            { name: "calculator", type: Types.FUNCTION }], function (startTime, duration, calculator) {
                animations.push({ startTime, duration, calculator });
                return this;
            })
    });
    //Add the set function
    var sets = [];
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
    //Add the at function.
    Object.defineProperty(o, "at", {
        enumerable: true,
        configurable: false,
        value: typedFunction([{ name: "time", type: Types.NON_NEGATIVE_NUMBER }], function (time) {
            var at = {};
            //Copy all values
            for (let k in this) {
                if (!["animate", "at"].includes(k)) {
                    let v = this[k];
                    if (typeof v === 'function') {
                        v = v.bind(at);
                    }
                    at[k] = v;
                }
            }
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
                    runCalculator(a.calculator, progress);
                }
                else if (time > a.startTime + a.duration && a.calculator.lasts) {
                    runCalculator(a.calculator, 1);
                }
            }
            function runCalculator(calculator, progress) {
                let value = calculator(progress);
                let err = oInterface(value);
                if (!err) {
                    at = Object.assign(at, value);
                }
                else {
                    throw new TypeError(`Problem with animate function: ${err}`);
                }
            }
            return at;
        })
    });
});

//Export the module
module.exports = { propertiesType, methodsToBindType, animanage };