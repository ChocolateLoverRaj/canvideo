//Color Type

//Dependencies
const { Types, Interface, either } = require("../type");

//Color interface
const colorInterface = new Interface(false)
    .optional('r', Types.RGB_INTENSITY)
    .optional('g', Types.RGB_INTENSITY)
    .optional('b', Types.RGB_INTENSITY)
    .optional('a', Types.UNIT_INTERVAL)
    .toType();

//Input either a color interface or a string representation of a color
const colorType = either(colorInterface, Types.COLOR);

//Export the colorType
module.exports = colorType;