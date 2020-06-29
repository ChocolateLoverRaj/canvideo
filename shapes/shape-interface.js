//Minimal shape interface

//Dependencies
const { Interface, Types } = require("../type");

//Shape interface
const shapeInterface = new Interface(true)
    .required("at", Types.FUNCTION)
    .optional("name", Types.STRING)
    .toType();

//Export the interface
module.exports = shapeInterface;