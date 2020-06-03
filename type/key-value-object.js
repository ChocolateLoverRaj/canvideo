//File for creating a special object type.
//This object needs to have a certain type for its values.

//Dependencies
const Types = require("./types");
const typedFunction = require("./typed-function");

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

//Export the module
module.exports = keyValueObject;