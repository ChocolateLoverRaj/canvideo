//Manage animatable properties

//Dependencies
const { Types, typedFunction, keyValueObject, interface, either, Interface, arrayOf } = require("./type");
const Animation = require("./animation");

const propertiesType1 = Types.TYPE;
const propertiesType2 = interface({
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
}, false);
const propertiesType = keyValueObject(either(propertiesType1, propertiesType2));

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
        name: "methodsToBind", type: arrayOf(Types.STRING)
    }
]
const animanage = typedFunction(params, function (o, properties, methodsToBind) {
    //Add properties, getters/setters, and hidden properties.
    var oInterface = new Interface(false);
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
        oInterface.optional(k, type || Types.ANY);
    }
    oInterface = oInterface.toType();
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
    //Add the at function.
    Object.defineProperty(o, "at", {
        enumerable: true,
        configurable: false,
        value: typedFunction([{ name: "time", type: Types.NON_NEGATIVE_NUMBER }], function (time) {
            var at = {};
            //Loop through animations
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
                let thisMethod = this.__proto__[method];
                if (thisMethod) {
                    at.__proto__[method] = thisMethod.bind(at);
                }
                else {
                    throw new TypeError(`Couldn't bind method: ${method}`);
                }
            }
            for (var i = 0; i < animations.length; i++) {
                let a = animations[i];
                if (time => a.startTime && time < a.startTime + a.duration) {
                    let progress = (time - a.startTime) / a.duration;
                    let value = a.f(progress);
                    let err = oInterface(value);
                    if (!err) {
                        at = Object.assign(at, a.f(progress));
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

class Rectangle {
    constructor(x, y, width, height) {
        animanage(this, {
            x: Types.NUMBER,
            y: Types.NUMBER,
            width: Types.NUMBER,
            height: Types.NUMBER,
        }, ["draw"]);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        console.log(this.x, this.y, this.width, this.height);
    }
}

var rect = new Rectangle(0, 0, 400, 400);
rect.animate(0, 10, new Animation(
    {
        x: 0,
        y: 200
    },
    {
        x: 100,
        y: 0
    }
).calculate);

rect.at(1).draw();

//Export the module
module.exports = animanage;