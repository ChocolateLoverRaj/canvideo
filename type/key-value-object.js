//File for creating a special object type.
//This object needs to have a certain type for its values.

//Dependencies
import { TYPE } from "./types";
import typedFunction from "./typed-function";

//Creates a type based on given valueType.
export default keyValueObject = typedFunction([{ name: "valueType", type: TYPE }], function (valueType) {
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