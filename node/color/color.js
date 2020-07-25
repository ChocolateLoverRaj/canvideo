//Color Type

//Dependencies
import Types from "../../common/type/types.js";
import { Interface } from "../../common/type/interface.js";
import either from "../../common/type/either.js";

//Color interface
const colorInterface = new Interface(false)
    .optional('r', Types.RGB_INTENSITY)
    .optional('g', Types.RGB_INTENSITY)
    .optional('b', Types.RGB_INTENSITY)
    .optional('a', Types.UNIT_INTERVAL)
    .toType();

//Input either a color interface or a string representation of a color
const colorType = either(colorInterface, Types.COLOR);

export default colorType;