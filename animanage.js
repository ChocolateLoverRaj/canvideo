//Manage animatable properties

//Dependencies
const { Types, typedFunction, keyValueObject, interface, either } = require("./type");

const propertiesType1 = keyValueObject(Types.TYPE);
const propertiesType2 = keyValueObject(interface({
    type: {
        type: Types.TYPE,
        required: false
    },
    setter: {
        type: Types.SETTER,
        required: false
    },
    getter: {
        type: Types.GETTER,
        required: false
    }
}, false));
const propertiesType = either(propertiesType1, propertiesType2);

const params = [
    {
        name: "o",
        type: Types.OBJECT
    },
    {
        name: "properties",
        type: propertiesType
    }
]
const animanage = typedFunction(params, function (o, properties) {
    //Add properties, getters/setters, and hidden properties.
    var typedAt = {};
    for (let k in properties) {
        let p = properties[k];
        let type = p.type || p;
        let hiddenKey = '_' + k;
        let setFunction = function (v) {
            Object.defineProperty(o, hiddenKey, {
                configurable: true,
                enumerable: false,
                value: v
            });
        };
        let setterAfterFilter = p.setter || setFunction;
        let setter = type ?
            function (v) {
                let err = type(v);
                if (!err) {
                    return setterAfterFilter(v, setFunction);
                }
                else {
                    throw new TypeError(`${k}: ${v}, ${err}`);
                }
            } :
            setterAfterFilter;
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
        Object.defineProperty(typedAt, k, property);
    }
    //Add the animate function
    var animations = [];
    Object.defineProperty(o, "animate", {
        enumerable: true,
        configurable: false,
        value: typedFunction([
            { name: "startTime", type: Types.NON_NEGATIVE_NUMBER },
            { name: "duration", type: Types.NON_NEGATIVE_NUMBER },
            { name: "f", type: Types.FUNCTION }], function (startTime, duration, f) {
                animations.push({ startTime, duration, f });
            })
    });
    //Add the at function.
    Object.defineProperty(o, "at", {
        enumerable: true,
        configurable: false,
        value: typedFunction([{ name: "time", type: Types.NON_NEGATIVE_NUMBER }], function (time) {
            //Loop through animations
            for (let k in this) {
                if (!["animate", "at"].includes(k)) {
                    typedAt[k] = this[k];
                }
            }
            var at = {};
            for (var i = 0; i < animations.length; i++) {
                let a = animations[i];
                if (time => a.startTime && time < a.startTime + a.duration) {
                    let progress = (time - a.startTime) / a.duration;
                    at = Object.assign(at, a.f(progress));
                }
            }
            typedAt = Object.assign(typedAt, at);
            return typedAt;
        })
    });
});

//Export the module
module.exports = animanage;