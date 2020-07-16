//File which contains Shape class
//All other shapes are extensions of this class

//Dependencies
//Npm Modules
const tinyColor = require('tinycolor2');
const canvas = require('canvas');

//My Modules
const { propertiesType, methodsToBindType, animanage } = require("../animations/animanage");
const { Types, typedFunction, instanceOf } = require("../type");
const colorType = require("../render/color");

//Figure out whether ctx given is actually ctx.
const ctxType = a => a instanceof canvas.CanvasRenderingContext2D ? false : "is not canvasRenderingContext2D.";

//Shape class
class Shape {
    static shapeName = "shape";
    shapeName = "shape";

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true },
        { name: "shape", type: instanceOf(Shape), optional: true }
    ], function (json, parse = true, throwErrors = false, caMappings = new Map(), shape) {
        let shapeGiven = false;
        if (shape instanceof Shape) {
            shapeGiven = true;
        }
        else {
            shape = new Shape();
        }
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            var { fillColor, strokeColor, strokeWidth, animations, sets } = json;
            if (fillColor) {
                shape.fill(fillColor);
            }
            if (strokeColor) {
                shape.stroke(strokeColor, strokeWidth);
            }
            shape.animations.importJson(animations, false, caMappings);
            shape.sets.importJson(sets, false);
            return shapeGiven ? [shape, json] : shape;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

    constructor() {
        typedFunction([
            {
                name: "properties",
                type: propertiesType,
                optional: true,
                default: {}
            },
            {
                name: "methodsToBind",
                type: methodsToBindType,
                optional: true,
                default: []
            }
        ], function (properties = {}, methodsToBind = []) {
            const shapeProperties = {
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
                strokeWidth: {
                    type: Types.NON_NEGATIVE_NUMBER,
                    initial: 0
                }
            }

            properties = Object.assign(properties, shapeProperties);

            const shapeMethodsToBind = ["draw", "getHash"];
            methodsToBind = [...new Set([...shapeMethodsToBind, ...methodsToBind])];

            animanage(this, properties, methodsToBind);
        }).apply(this, arguments);
    }

    fill(color) {
        this.fillColor = color;
        return this;
    }
    stroke(color, width = this.strokeWidth) {
        this.strokeColor = color;
        this.strokeWidth = width;
        return this;
    }
    draw() {
        return typedFunction([{ name: "ctx", type: ctxType }], function (ctx) {
            if (this.isExplicitlySet("fillColor")) {
                ctx.fillStyle = this.fillColor.hexString;
            }
            if (this.isExplicitlySet("strokeColor")) {
                ctx.strokeStyle = this.strokeColor.hexString;
            }
            if (this.isExplicitlySet("strokeWidth")) {
                ctx.lineWidth = this.strokeWidth;
            }
            return this;
        }).apply(this, arguments);
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            fillColor: this.isExplicitlySet("fillColor") ? this.fillColor.hexString : undefined,
            strokeColor: this.isExplicitlySet("strokeColor") ? this.strokeColor.hexString : undefined,
            strokeWidth: this.isExplicitlySet("strokeWidth") ? this.strokeWidth : undefined,
            animations: this.animations.toJson(false, fps),
            sets: this.sets.toJson(false)
        };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Export the module
module.exports = Shape;