//Types that are shared between animanage and typify

//Dependencies
import Types from "../../common/type/types.js";
import { interfaceToType } from "../../common/type/interface.js";
import keyValueObject from "../../common/type/key-value-object.js";
import either from "../../common/type/either.js";
import arrayOf from "../../common/type/array-of.js";

export const propertiesType1 = Types.TYPE;
export const propertiesType2 = interfaceToType({
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