//Quick way of getting shapes

//Dependencies
const Shape = require("./shape");
const Rectangle = require("./rectangle");
const Group = require("./group");
const Circle = require("./circle");
const Polygon = require("./polygon");
const NumberLine = require("./number-line");
const Path = require("./path");

//Shapes module
const shapes = { Shape, Rectangle, Group, Circle, Polygon, NumberLine, Path };

//Check if a shape is builtin or not
shapes.isBuiltin = shape =>
    shape instanceof Shape ||
    shape instanceof Rectangle ||
    shape instanceof Group ||
    shape instanceof Circle ||
    shape instanceof Polygon ||
    shape instanceof NumberLine ||
    shape instanceof Path;

//Export the module
module.exports = shapes;