//File for creating a special array type.
//This type is an array where every element is a certain type.

//Dependencies
import { TYPE, NON_NEGATIVE_INTEGER, ARRAY } from "./types";

//Create an array type by giving a type.
export default arrayOf = (type, length) => {
    let err = TYPE(type);
    if (!err) {
        let err = NON_NEGATIVE_INTEGER(length);
        if (!err || typeof length === 'undefined') {
            return a => {
                let err = ARRAY(a);
                if (!err) {
                    if (typeof length === 'number' && a.length !== length) {
                        return `does not have length: ${length}.`
                    }
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
            throw new TypeError(`length: ${length}, ${err}`);
        }
    }
    else {
        throw new TypeError(`type: ${type}, ${err}`);
    }
}