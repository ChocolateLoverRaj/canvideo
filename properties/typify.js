//Typify properties on object

//Dependencies
const { Types, typedFunction } = require("../type");
const { propertiesType } = require("./properties-type");

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
function typify() {
    typedFunction(params, function (o, properties) {
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
    }).apply(this, arguments);
};

//Export the function
module.exports = typify;