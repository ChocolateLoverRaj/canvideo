//Color Type

//Dependencies
import Types from "../type/types.js";
import {Interface} from "../type/interface.js";
import either from "../type/either.js";

//Color interface
const colorInterface = new Interface(false)
    .optional('r', Types.RGB_INTENSITY)
    .optional('g', Types.RGB_INTENSITY)
    .optional('b', Types.RGB_INTENSITY)
    .optional('a', Types.UNIT_INTERVAL)
    .toType();

//Input either a color interface or a string representation of a color
export default colorType = either(colorInterface, Types.COLOR);