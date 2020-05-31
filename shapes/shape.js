//File which contains Shape class
//All other shapes are extensions of this class

//Dependencies
//Npm Modules
const tinyColor = require('tinycolor2');

//My Modules
const animanage = require("../animanage");
const { Types, Interface } = require("../type");

//Color interface
const colorInterface = new Interface(false)
    .optional('r', Types.RGB_INTENSITY)
    .optional('g', Types.RGB_INTENSITY)
    .optional('b', Types.RGB_INTENSITY)
    .optional('a', Types.UNIT_INTERVAL);

//Shape class
class Shape {
    constructor(x, y, width, height) {
        animanage(this, {
            fillColor: {
                type: colorInterface
            }
        })
    }
}