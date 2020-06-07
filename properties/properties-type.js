//Types that are shared between animanage and typify

//Dependencies
const {Types, interface, keyValueObject, either, arrayOf} = require("../type");

const propertiesType1 = Types.TYPE;
const propertiesType2 = interface({
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
const propertiesType = keyValueObject(either(propertiesType1, propertiesType2));
const methodsToBindType = arrayOf(Types.STRING);

//Export the module
module.exports = {
    propertiesType1,
    propertiesType2,
    propertiesType,
    methodsToBindType
};