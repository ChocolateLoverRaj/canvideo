//File which contains Shape class
//All other shapes are extensions of this class

//Dependencies
import tinyColor from "../color/tiny-color.js";
import { propertiesType, animanage } from "../animations/animanage.js";
import { methodsToBindType } from "../properties/properties-type.js";
import Types from "../type/types.js";
import typedFunction from "../type/typed-function.js";
import instanceOf from "../type/instanceOf.js";
import colorType from "../color/color.js";
import { hexStringSchema } from "../color/color-schema.js";
import Animation from "../animations/animation.js";
import Precomputed from "../animations/precomputed.js";

//Both fillColor and strokeColor use this
const animateColor = {
    r: "number",
    g: "number",
    b: "number",
    a: "number"
};

//Get a value schema
const getValueSchema = (properties) => {
    const getSchema = properties => {
        const getProperty = v => {
            switch (typeof v) {
                case "string":
                    if (v === "number") {
                        return { type: "number" };
                    }
                    else {
                        throw new TypeError("Unknown type");
                    }
                case "object": {
                    return getSchema(v);
                }
            }
        }
        if (properties instanceof Array) {
            return {
                type: "array",
                items: getProperty(properties[0])
            };
        }
        else {
            let valueProperties = {};
            for (let k in properties) {
                valueProperties[k] = getProperty(properties[k]);
            }
            return {
                properties: valueProperties,
                type: "object",
                additionalProperties: false
            };
        }
    }
    return getSchema(properties);
}

//Shape class
class Shape {
    static shapeName = "shape";
    shapeName = "shape";

    static getJsonSchema = (properties, requiredProperties, animateProperties) => {
        let animateSchema = getValueSchema(animateProperties);
        return {
            properties: {
                ...properties,
                animations: {
                    type: "array",
                    items: {
                        properties: {
                            startTime: { type: "number", minimum: 0 },
                            duration: { type: "number", minimum: 0 },
                            isBuiltin: { ype: "boolean" },
                            name: { type: "string" },
                            lasts: { type: "boolean" }
                        },
                        required: ["startTime", "duration", "isBuiltin", "lasts"],
                        if: { properties: { isBuiltin: { const: true } } },
                        then: {
                            properties: { name: { enum: ["animation", "precomputed"] } },
                            required: ["name", "data"],
                            allOf: [
                                {
                                    if: { properties: { name: { const: "animation" } } },
                                    then: {
                                        properties: {
                                            data: Animation.getJsonSchema(animateSchema)
                                        }
                                    }
                                },
                                {
                                    if: { properties: { name: { const: "precomputed" } } },
                                    then: {
                                        properties: {
                                            data: Precomputed.getJsonSchema(animateSchema)
                                        }
                                    }
                                }
                            ]
                        },
                        else: {
                            properties: { name: { type: "string" } }
                        }
                    }
                },
                sets: {
                    type: "array",
                    items: {
                        properties: {
                            at: { type: "number", minimum: 0 },
                            value: animateSchema
                        },
                        required: ["at", "value"]
                    }
                }
            },
            required: [...new Set([...requiredProperties, "animations", "sets"])],
            additionalProperties: false
        }
    }
    static jsonPropertiesSchema = {
        fillColor: hexStringSchema,
        strokeColor: hexStringSchema,
        strokeWidth: { type: "number", minimum: 0 }
    }
    static jsonRequiredProperties = []
    static animateProperties = {
        fillColor: animateColor,
        strokeColor: animateColor,
        strokeWidth: "number"
    }
    static jsonSchema = this.getJsonSchema(
        this.jsonPropertiesSchema,
        this.jsonRequiredProperties,
        this.animateProperties
    )

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

            const shapeMethodsToBind = ["draw"];
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
        return typedFunction([{ name: "ctx", type: Types.CANVAS_CTX }], function (ctx) {
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

export default Shape;