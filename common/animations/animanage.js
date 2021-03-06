//Manage animatable properties

//Dependencies
import Types from "../type/types.js";
import typedFunction from "../type/typed-function.js";
import keyValueObject from "../type/key-value-object.js";
import { interfaceToType, Interface } from "../type/interface.js";
import instanceOf from "../type/instanceOf.js";
import either from "../type/either.js";
import { methodsToBindType } from "../properties/properties-type.js";
import Animation from "./animation.js";
import Precomputed from "./precomputed.js";

//Properties type
export const propertiesType = keyValueObject(either(Types.TYPE, interfaceToType({
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
    .add(Precomputed);

export const animanage = typedFunction(params, function (o, properties, methodsToBind) {
    //List of properties that were explicitly set
    var explicit = new Set();

    //Add properties, getters/setters, hidden properties, and toJson.
    var oInterface = new Interface(false);
    var propertiesToDefine = {};
    var propertiesToJson = new Map();
    for (let k in properties) {
        //The provided value
        let p = properties[k];

        //P could either have a property called type or be a type itself
        let type = p.type || p;

        //Hidden keys are the key prepended with '_'
        let hiddenKey = '_' + k;

        //Make the hidden key a non configurable, non enumerable key that can still be chanegd
        Object.defineProperty(o, hiddenKey, {
            configurable: false,
            enumerable: false,
            writable: true,
            value: p.initial
        });

        //A function that sets the hidden key
        let setFunction = function (v) {
            this[hiddenKey] = v;
        };

        //Default to setFunction if setter is not provided
        let setterAfterFilter = p.setter || setFunction;

        //Function that calls the default / provided setter
        let callSetter = function (v) {
            //This was explicitly set
            explicit.add(k);

            //Call the setter with 'this' so that 'this' refers to whatever is being animated.
            //Pass setFunction as an argument so that the provided setter can easily set hidden keys.
            //This is convenient, but would also help if we changed the hidden key prefix to something other than '_'.
            //Bind the setFunction to 'this' so that the given setter cannot mess up calling the set function.
            return setterAfterFilter.call(this, v, setFunction.bind(this));
        }

        //Setter based on if the property is typed
        let setter = type ?
            function (v) {
                //The TypeError, if the value did not match the type constraints.
                let err = type(v);
                if (!err) {
                    //Call the callSetter function now that we've checked the type.
                    //Remember to return whatever it returns/
                    //Remember to bind it to 'this'
                    return callSetter.call(this, v);
                }
                else {
                    throw new TypeError(`${k}: ${v}, ${err}`);
                }
            } :
            callSetter;

        //The default getter function simply returns the hidden key.
        let getter = p.getter || function () {
            return this[hiddenKey];
        };

        //The options for Object.defineProperty
        let property = {
            configurable: false,
            enumerable: true,
            set: setter,
            get: getter
        };

        //Add to the propertiesToDefine object
        propertiesToDefine[k] = property;

        //Define the property
        Object.defineProperty(o, k, property);

        //Add the type to the interface
        oInterface.optional(k, type || Types.ANY);

        //Add the toJson method to the propertiesToJson map, if specified
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
    }
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
                }
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
    })
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
    }
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
                else if (time > a.startTime + a.duration && a.animator.lasts) {
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