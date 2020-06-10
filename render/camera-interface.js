//Interface for camera

//Dependencies
const { Interface, Types } = require("../type");

//Camera interface
const cameraInterface = new Interface(true)
    .required("scaleX", Types.NUMBER)
    .required("scaleY", Types.NUMBER)
    .required("refX", Types.NUMBER)
    .required("refY", Types.NUMBER)
    .required("x", Types.NUMBER)
    .required("y", Types.NUMBER)
    .toType();

//Export the interface
module.exports = cameraInterface;