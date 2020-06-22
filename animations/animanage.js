//Manage animatable properties

//Dependencies
const { Types, typedFunction, keyValueObject, interface, either, Interface, arrayOf } = require("../type");
const { propertiesType, methodsToBindType } = require("../properties/properties-type");
const Animation = require("./animation");
const Precomputed = require("./precomputed");

//Animator interface
const animatorInterface = new Interface(true)
    .optional("name", Types.STRING)
    .toType();

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

//List of built in animations
const builtInAnimations = new Set()
    .add(Animation)
    .add(Precomputed)

const animanage = typedFunction(params, function (o, properties, methodsToBind) {
    //List of properties that were explicitly set
    var explicit = new Set();

    //Add properties, getters/setters, and hidden properties.
    var oInterface = new Interface(false);
    var propertiesToDefine = {};
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
    //add the toJson method to the animations
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
                    o.lasts = false;
                }
                else {
                    o.name = animator.name || undefined;
                    o.lasts = animator.lasts || false;
                }
                if (isCalculator || isCustom && !(typeof animator.toJson === 'function')) {
                    //Implicitly create a precomputed animation
                    let values = [];
                    for (var j = 0; j <= 1; j += 1 / fps) {
                        values.push([j, animator(j)]);
                    }
                    var implicitPrecomputed = new Precomputed(values);
                    o.name = implicitPrecomputed.name;
                    o.data = implicitPrecomputed.toJson(false);
                }
                else {
                    o.data = animator.toJson(false);
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
    }
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
                    isCustom: false
                };
                if (typeof animator === 'object') {
                    for (let builtIn of builtInAnimations.keys()) {
                        if (animator instanceof builtIn) {
                            animation.isCustom = false;
                            break;
                        }
                    }
                }
                else {
                    animation.isCustom = true;
                }
                animations.push(animation);
                return this;
            })
    });
    //Add the set function
    var sets = o.sets = [];
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
            return at;
        })
    });
});

//Export the module
module.exports = { propertiesType, methodsToBindType, animanage };