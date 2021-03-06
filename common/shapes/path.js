//Draw a path, similar to ctx path.

//Dependencies
import Shape from "./shape.js";
import Types from "../type/types.js";
import typedFunction from "../type/typed-function.js";
import arrayOf from "../type/array-of.js";
import instanceOf from "../type/instanceOf.js";
import { numberSchema, positiveNumberSchema } from "../schema/number.js";

//Path class
class Path extends Shape {
    static shapeName = "path";
    shapeName = "path";

    static jsonPropertiesSchema = {
        ...super.jsonPropertiesSchema,
        doFill: { type: "boolean" },
        strokeDash: { type: "array", items: numberSchema },
        strokeDashOffset: numberSchema,
        operations: {
            type: "array",
            items: {
                anyOf: [
                    {
                        type: "array",
                        items: [
                            {
                                const: "moveTo"
                            },
                            {
                                type: "array",
                                items: [
                                    numberSchema,
                                    numberSchema
                                ],
                                minItems: 2,
                                maxItems: 2
                            }
                        ],
                        minItems: 2,
                        maxItems: 2
                    },
                    {
                        type: "array",
                        items: [
                            {
                                const: "lineTo"
                            },
                            {
                                type: "array",
                                items: [
                                    numberSchema,
                                    numberSchema
                                ],
                                minItems: 2,
                                maxItems: 2
                            }
                        ],
                        minItems: 2,
                        maxItems: 2
                    },
                    {
                        type: "array",
                        items: [
                            {
                                const: "arc"
                            },
                            {
                                type: "array",
                                items: [
                                    numberSchema,
                                    numberSchema,
                                    positiveNumberSchema,
                                    numberSchema,
                                    numberSchema,
                                    { type: "boolean" }
                                ],
                                minItems: 6,
                                maxItems: 6
                            }
                        ],
                        minItems: 2,
                        maxItems: 2
                    }
                ]
            }
        }
    }
    static jsonRequiredProperties = [
        ...super.jsonRequiredProperties,
        "doFill",
        "strokeDash",
        "strokeDashOffset",
        "operations"
    ]
    static animateProperties = {
        ...super.animateProperties,
        strokeDash: ["number"],
        strokeDashOffset: "number"
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
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let [path, {
                doFill, strokeDash, strokeDashOffset, operations
            }] = Shape.fromJson(json, false, true, caMappings, new Path());
            path.strokeDash = strokeDash;
            path.strokeDashOffset = strokeDashOffset;
            if (typeof doFill === 'boolean') {
                path.doFill = doFill;
            }
            else {
                throw new TypeError("path doFill must be a boolean.");
            }
            for (let [name, args] of operations) {
                if (["moveTo", "lineTo", "arc"].includes(name)) {
                    path[name](...args);
                }
                else {
                    throw new TypeError(`Unknown operation name: ${name}.`);
                }
            }
            return path;
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

    constructor(fill = false) {
        if (typeof fill === 'boolean') {
            super({
                strokeDash: {
                    initial: [],
                    type: arrayOf(Types.NON_NEGATIVE_NUMBER)
                },
                strokeDashOffset: Types.NUMBER
            });
            this.operations = [];
            this.doFill = fill;
        }
        else {
            throw new TypeError("fill must be boolean.");
        }
    }

    setStrokeDash(strokeDash) {
        this.strokeDash = strokeDash;
        return this;
    }
    setStrokeDashOffset(strokeDashOffset) {
        this.strokeDashOffset = strokeDashOffset;
        return this;
    }

    moveTo(x, y) {
        typedFunction([{ name: "x", type: Types.NUMBER }, { name: "y", type: Types.NUMBER }], function (x, y) {
            this.operations.push(["moveTo", [x, y]]);
        }).call(this, x, y);
        return this;
    }
    lineTo(x, y) {
        typedFunction([{ name: "x", type: Types.NUMBER }, { name: "y", type: Types.NUMBER }], function (x, y) {
            this.operations.push(["lineTo", [x, y]]);
        }).call(this, x, y);
        return this;
    }
    arc() {
        typedFunction([
            { name: "x", type: Types.NUMBER },
            { name: "y", type: Types.NUMBER },
            { name: "radius", type: Types.NON_NEGATIVE_NUMBER },
            { name: "startAngle", type: Types.NUMBER },
            { name: "endAngle", type: Types.NUMBER },
            { name: "antiClockwise", type: Types.BOOLEAN, optional: true }
        ], function (x, y, radius, startAngle, endAngle, antiClockwise = false) {
            //Angles are in clock hour format (0 on top, 6 on bottom)
            //Convert clock hours to radians
            startAngle = (startAngle - 3) * Math.PI / 6;
            endAngle = (endAngle - 3) * Math.PI / 6;
            this.operations.push(["arc", [x, y, radius, startAngle, endAngle, antiClockwise]]);
        }).apply(this, arguments);
        return this;
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.setLineDash(this.strokeDash);
        ctx.lineDashOffset = this.strokeDashOffset

        ctx.beginPath();
        for (var i = 0; i < this.operations.length; i++) {
            let [method, args] = this.operations[i];
            ctx[method](...args);
        }
        if (this.doFill) {
            ctx.closePath();
            ctx.fill();
        }
        if (this.strokeWidth > 0) {
            ctx.stroke();
        }

        return this;
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            ...super.toJson(false, fps),
            doFill: this.doFill,
            strokeDash: this.strokeDash,
            strokeDashOffset: this.strokeDashOffset,
            operations: this.operations
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

export default Path;