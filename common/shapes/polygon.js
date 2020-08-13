//Draw polygons with any number of sides

//Dependencies
import Shape from "./shape.js";
import arrayOf from "../type/array-of.js";
import typedFunction from "../type/typed-function.js";
import Types from "../type/types.js";
import instanceOf from "../type/instanceOf.js";
import pointInterface from "./point-interface.js";
import { numberSchema } from "../schema/number.js";

//Polygon class
class Polygon extends Shape {
    static shapeName = "polygon";
    shapeName = "polygon";

    static jsonPropertiesSchema = {
        ...Shape.jsonPropertiesSchema,
        points: {
            type: "array",
            items: {
                properties: {
                    x: numberSchema,
                    y: numberSchema
                },
                required: ["x", "y"]
            }
        }
    }
    static jsonRequiredProperties = [
        ...Shape.jsonRequiredProperties,
        "points"
    ]
    static animateProperties = {
        ...Shape.animateProperties,
        "points": [{
            x: "number",
            y: "number"
        }]
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
            let [polygon, { points }] = Shape.fromJson(json, false, true, caMappings, new Polygon());
            polygon.points = points;
            return polygon;
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
        super({
            points: {
                type: arrayOf(pointInterface),
                initial: []
            }
        });
        switch (typeof arguments[0]) {
            case 'number':
                if (arguments.length & 1) {
                    throw new TypeError("Cannot have odd number of arguments in a list of x, y.");
                }
                else {
                    for (var i = 0; i < arguments.length; i += 2) {
                        if (typeof arguments[i] === 'number' && typeof arguments[i + 1] === 'number') {
                            this.points.push({
                                x: arguments[i],
                                y: arguments[i + 1]
                            });
                        }
                        else {
                            throw new TypeError("Bad list of x and ys.");
                        }
                    }
                }
                break;
            case 'object':
                if (arguments[0] instanceof Array) {
                    for (var i = 0; i < arguments.length; i++) {
                        let arg = arguments[i];
                        if (arg instanceof Array && arg.length === 2) {
                            if (typeof arg[0] === 'number' && typeof arg[1] === "number") {
                                this.points.push({
                                    x: arg[0],
                                    y: arg[1]
                                });
                            }
                            else {
                                throw new TypeError("Expected [number, number].");
                            }
                        }
                        else {
                            throw new TypeError("Expected all args to be an array of [x, y].");
                        }
                    }
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        let arg = arguments[i];
                        let err = pointInterface(arg);
                        if (!err) {
                            this.points.push(arg);
                        }
                        else {
                            throw new TypeError(`point ${i}: ${arg}, ${err}`);
                        }
                    }
                }
                break;
            case 'undefined':
                if (arguments.length > 0) {
                    throw new TypeError("First argument cannot be undefined.");
                }
                break;
            default:
                throw new TypeError("Invalid construction.");
        }
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();
        if (this.strokeWidth > 0) {
            ctx.stroke();
        }

        return this;
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            ...super.toJson(false, fps),
            points: this.points
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

export default Polygon;