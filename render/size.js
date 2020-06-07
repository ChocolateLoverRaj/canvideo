//Videos must have a number for width and height
//Those numbers must be even

//Dependencies
const { Interface, either } = require("../type");

//Size type
const sizeType = a => Number.isSafeInteger(a) && a > 0 && !(a & 1) ? false : "is not a valid size.";

//Interface for video size
const regularSizeInterface = new Interface(false)
    .required("width", sizeType)
    .required("height", sizeType)
    .toType();

//Shortened property names
const shortSizeInterface = new Interface(false)
    .required("w", sizeType)
    .required("h", sizeType)
    .toType();

//Use the regular one or the short one
const sizeInterface = either(regularSizeInterface, shortSizeInterface);

//Export the interface
module.exports = { sizeType, regularSizeInterface, shortSizeInterface, sizeInterface };