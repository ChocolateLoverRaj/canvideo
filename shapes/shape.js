//File which contains Shape class
//All other shapes are extensions of this class

//Dependencies
//Npm Modules
const tinyColor = require('tinycolor2');
const canvas = require('canvas');

//My Modules
const animanage = require("../animanage");
const Animation = require("../animation");
const { Types, Interface, either, typedFunction } = require("../type");

//Color interface
const colorInterface = new Interface(false)
    .optional('r', Types.RGB_INTENSITY)
    .optional('g', Types.RGB_INTENSITY)
    .optional('b', Types.RGB_INTENSITY)
    .optional('a', Types.UNIT_INTERVAL)
    .toType();

//Input either a color interface or a string representation of a color
const colorType = either(colorInterface, Types.COLOR);

//Figure out whether ctx given is actually ctx.
const ctxType = a => a instanceof canvas.CanvasRenderingContext2D ? false : "is not canvasRenderingContext2D.";

//Shape class
class Shape {
    constructor() {
        animanage(this, {
            fillColor: {
                type: colorType,
                initial: new tinyColor(),
                setter: function (v, set) {
                    if (typeof v === 'object') {
                        set(new tinyColor(Object.assign(this.fillColor, v)));
                    }
                    else {
                        set(new tinyColor(v));
                    }
                },
                getter: function () {
                    let colors = this._fillColor.toRgb();
                    colors.hexString = this._fillColor.toHexString();
                    return colors;
                }
            },
            strokeColor: {
                type: colorType,
                initial: new tinyColor(),
                setter: function (v, set) {
                    if (typeof v === 'object') {
                        set(new tinyColor(Object.assign(this.strokeColor, v)));
                    }
                    else {
                        set(new tinyColor(v));
                    }
                },
                getter: function () {
                    let colors = this._strokeColor.toRgb();
                    colors.hexString = this._strokeColor.toHexString();
                    return colors;
                }
            },
            strokeWidth: Types.NON_NEGATIVE_NUMBER
        }, ["draw"]);

        this.strokeWidth = 1;
    }

    fill(color) {
        this.fillColor = color;
        return this;
    }
    stroke(color) {
        this.strokeColor = color;
        return this;
    }
    draw = typedFunction([{ name: "ctx", type: ctxType }], function (ctx) {
        ctx.fillStyle = this.fillColor.hexString;
        ctx.strokeStyle = this.strokeColor.hexString;
        ctx.strokeWidth = this.strokeWidth;
        return this;
    });
}

//Export the module
module.exports = Shape;