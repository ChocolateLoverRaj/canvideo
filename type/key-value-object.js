//File for creating a special object type.
//This object needs to have a certian type for its values.

//Dependencies
const Types = require("./types");

//Creates a type based on given valueType.
function keyValueObject(valueType) {
    let err = Types.TYPE(valueType);
    if (!err) {
        return a => {
            let err = Types.OBJECT(a);
            if (!err) {
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
                return `object: ${a}, ${err}`;
            }
        }
    }
    else {
        throw new TypeError(`valueType: ${valueType}, ${err}`);
    }
}

//Export the module
module.exports = keyValueObject;