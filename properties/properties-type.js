//Types that are shared between animanage and typify

//Dependencies
import Types from "../type/types.js";
import { interface } from "../type/interface.js";
import keyValueObject from "../type/key-value-object.js";
import either from "../type/either";
import arrayOf from "../type/array-of";

export const propertiesType1 = Types.TYPE;
export const propertiesType2 = interface({
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
    }
}, false);
export const propertiesType = keyValueObject(either(propertiesType1, propertiesType2));
export const methodsToBindType = arrayOf(Types.STRING);