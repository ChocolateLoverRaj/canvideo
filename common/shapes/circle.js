//Draw circles

//Dependencies
import Shape from "./shape.js";
import Types from "../type/types.js";
import arrayOf from "../type/array-of.js";
import Overloader from "../type/overloader.js";
import typedFunction from "../type/typed-function.js";
import instanceOf from "../type/instanceOf.js";
import pointInterface from "./point-interface.js";
import { numberSchema, positiveNumberSchema } from "../schema/number.js";

//Circle class
class Circle extends Shape {
    static shapeName = "circle";
    shapeName = "circle";

    static jsonPropertiesSchema = {
        ...super.jsonPropertiesSchema,
        cx: numberSchema,
        cy: numberSchema,
        r: positiveNumberSchema
    }
    static jsonRequiredProperties = [
        ...super.jsonRequiredProperties,
        "cx",
        "cy",
        "r"
    ]
    static animateProperties = {
        ...super.animateProperties,
        cx: "number",
        cy: "number",
        r: "number"
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
            let [circle, { cx, cy, r }] = Shape.fromJson(json, false, true, caMappings, new Circle(0, 0, 1));
            circle.cx = cx;
            circle.cy = cy;
            circle.r = r;
            return circle;
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

    constructor(cx, cy, r) {
        super({
            cx: Types.NUMBER,
            cy: Types.NUMBER,
            r: Types.POSITIVE_NUMBER
        });

        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    setCx(cx) {
        this.cx = cx;
        return this;
    }
    setCy(cy) {
        this.cy = cy;
        return this;
    }
    setC() {
        new Overloader()
            .overload([{ type: Types.NUMBER }, { type: Types.NUMBER }], function (x, y) {
                this.cx = x, this.cy = y;
            })
            .overload([{ type: pointInterface }], function ({ x, y }) {
                this.cx = x, this.cy = y;
            })
            .overload([{ type: arrayOf(Types.NUMBER, 2) }], function ([x, y]) {
                this.cx = x, this.cy = y;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.r, 0, 2 * Math.PI);
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
            cx: this.cx,
            cy: this.cy,
            r: this.r
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

export default Circle;