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
        }
        Object.defineProperty(o, k, {
            configurable: false,
            enumerable: true,
            set: setter,
            get: getter
        });
    }
    //Add the animate function
    Object.defineProperty(o, "animate", {
        enumerable: true,
        configurable: false,
        value: typedFunction([{ name: "f", type: Types.FUNCTION }], function (f) {

        })
    });
    //Add the at function.
    Object.defineProperty(o, "at", {
        enumerable: true,
        configurable: false,
        value: function () {
            //console.log(this)
        }
    });
});

class Rectangle {
    constructor() {
        typedFunction([
            {
                name: "x",
                type: Types.NUMBER
            },
            {
                name: "y",
                type: Types.NUMBER
            },
            {
                name: "width",
                type: Types.NUMBER
            },
            {
                name: "height",
                type: Types.NUMBER
            }
        ], function (x, y, width, height) {
            animanage(this, {
                x: Types.NUMBER,
                y: Types.NUMBER,
                width: Types.NUMBER,
                height: Types.NUMBER
            });
        }).apply(this, arguments);
    }
}

var rect = new Rectangle(0, 0, 400, 400);
rect.animate();
console.log(rect.at())