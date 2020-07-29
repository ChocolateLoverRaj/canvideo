//Videos must have a number for width and height
//Those numbers must be even

//Dependencies
import { Interface } from "../../common/type/interface.js";
import either from "../../common/type/either.js";

//Size type
export const sizeType = a => Number.isSafeInteger(a) && a > 0 && !(a & 1) ? false : "is not a valid size.";

//Interface for video size
export const regularSizeInterface = new Interface(false)
    .required("width", sizeType)
    .required("height", sizeType)
    .toType();

//Shortened property names
export const shortSizeInterface = new Interface(false)
    .required("w", sizeType)
    .required("h", sizeType)
    .toType();

//Use the regular one or the short one
export const sizeInterface = either(regularSizeInterface, shortSizeInterface);