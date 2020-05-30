//File for creating a special array type.
//This type is an array where every element is a certain type.

//Dependencies
const Types = require("./types");

//Create an array type by giving a type.
function arrayOf(type) {
    let err = Types.TYPE(type);
    if (!err) {
        return a => {
            let err = Types.ARRAY(a);
            if (!err) {
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
        throw new TypeError(`type: ${type}, ${err}`);
    }
}

//Export the module
module.exports = arrayOf;