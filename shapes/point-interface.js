//Common file for point interface (x, y)

//Dependencies
const { Interface, Types } = require("../type");

//Point interface
const pointInterface = new Interface(false)
    .required("x", Types.NUMBER)
    .required("y", Types.NUMBER)
    .toType();

//Export the interface
module.exports = pointInterface;