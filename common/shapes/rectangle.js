//File for creating rectangle class

//Dependencies
import Shape from "./shape.js";
import Types from "../type/types.js";
import { Interface } from "../type/interface.js";
import either from "../type/either.js";
import arrayOf from "../type/array-of.js";
import typedFunction from "../type/typed-function.js";
import instanceOf from "../type/instanceOf.js";
import { numberSchema } from "../schema/number.js";

//Corner round interface
const cornerRoundInterface = new Interface(false)
    .optional("topLeft", Types.NON_NEGATIVE_NUMBER)
    .optional("topRight", Types.NON_NEGATIVE_NUMBER)
    .optional("bottomLeft", Types.NON_NEGATIVE_NUMBER)
    .optional("bottomRight", Types.NON_NEGATIVE_NUMBER)
    .toType();
//Corner round array
const cornerRoundArray = arrayOf(Types.NON_NEGATIVE_NUMBER, 4);
//Corner round type
const cornerRoundType = either(Types.NON_NEGATIVE_NUMBER, cornerRoundInterface, cornerRoundArray);

//Two corners array
const twoCornersArray = arrayOf(Types.NON_NEGATIVE_NUMBER, 2);
//Vertical corner round interface
const verticalCornerRoundInterface = new Interface(false)
    .optional("left", Types.NON_NEGATIVE_NUMBER)
    .optional("right", Types.NON_NEGATIVE_NUMBER)
    .toType();
//Vertical corner round type
const verticalCornerRoundType = either(Types.NON_NEGATIVE_NUMBER, verticalCornerRoundInterface, twoCornersArray);

//Horizontal corner round interface
const horizontalCornerRoundInterface = new Interface(false)
    .optional("top", Types.NON_NEGATIVE_NUMBER)
    .optional("left", Types.NON_NEGATIVE_NUMBER)
    .toType();
//Horizontal corner round type
const horizontalCornerRoundType = either(Types.NON_NEGATIVE_NUMBER, horizontalCornerRoundInterface, twoCornersArray);

//Rectangle class
class Rectangle extends Shape {
    static shapeName = "rectangle";
    shapeName = "rectangle";

    static jsonPropertiesSchema = {
        ...super.jsonPropertiesSchema,
        x: numberSchema,
        y: numberSchema,
        width: numberSchema,
        height: numberSchema,
        cornerRound: {
            type: "object",
            properties: {
                topLeft: numberSchema,
                topRight: numberSchema,
                bottomLeft: numberSchema,
                bottomRight: numberSchema
            },
            required: ["topLeft", "topRight", "bottomLeft", "bottomRight"]
        }
    }
    static jsonRequiredProperties = [
        ...super.jsonRequiredProperties,
        "x",
        "y",
        "width",
        "height",
        "cornerRound"
    ]
    static animateProperties = {
        ...super.animateProperties,
        x: "number",
        y: "number",
        width: "number",
        height: "number",
        cornerRound: {
            topLeft: "number",
            topRight: "number",
            bottomLeft: "number",
            bottomRight: "number"
        }
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
            let [circle, {
                x, y,
                width, height,
                cornerRound: {
                    topLeft,
                    topRight,
                    bottomLeft,
                    bottomRight
                } }] = Shape.fromJson(json, false, true, caMappings, new Rectangle(0, 0, 0, 0));
            circle.x = x, circle.y = y;
            circle.width = width, circle.height = height;
            circle.cornerRound = {
                topLeft, topRight, bottomLeft, bottomRight
            };
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

    constructor(x, y, width, height, cornerRound = 0) {
        super({
            x: Types.NUMBER,
            y: Types.NUMBER,
            width: Types.NUMBER,
            height: Types.NUMBER,
            topLeftCornerRound: {
                initial: 0,
                type: Types.NON_NEGATIVE_NUMBER
            },
            topRightCornerRound: {
                initial: 0,
                type: Types.NON_NEGATIVE_NUMBER
            },
            bottomLeftCornerRound: {
                initial: 0,
                type: Types.NON_NEGATIVE_NUMBER
            },
            bottomRightCornerRound: {
                initial: 0,
                type: Types.NON_NEGATIVE_NUMBER
            },
            cornerRound: {
                type: cornerRoundType,
                setter: function (v) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            this.topLeftCornerRound = v[0];
                            this.topRightCornerRound = v[1];
                            this.bottomLeftCornerRound = v[2];
                            this.bottomRightCornerRound = v[3];
                        }
                        else {
                            if (v.hasOwnProperty("topLeft")) {
                                this.topLeftCornerRound = v.topLeft;
                            }
                            if (v.hasOwnProperty("topRight")) {
                                this.topRightCornerRound = v.topRight;
                            }
                            if (v.hasOwnProperty("bottomLeft")) {
                                this.bottomLeftCornerRound = v.bottomLeft;
                            }
                            if (v.hasOwnProperty("bottomRight")) {
                                this.bottomRightCornerRound = v.bottomRight;
                            }
                        }
                    }
                    else {
                        this.topLeftCornerRound = v;
                        this.topRightCornerRound = v;
                        this.bottomLeftCornerRound = v;
                        this.bottomRightCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        topLeft: this.topLeftCornerRound,
                        topRight: this.topRightCornerRound,
                        bottomLeft: this.bottomLeftCornerRound,
                        bottomRight: this.bottomRightCornerRound
                    };
                }
            },
            topCornerRound: {
                type: verticalCornerRoundType,
                setter: function (v) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            this.topLeftCornerRound = v[0];
                            this.topRightCornerRound = v[1];
                        }
                        else {
                            if (v.hasOwnProperty("left")) {
                                this.topLeftCornerRound = v["left"];
                            }
                            if (v.hasOwnProperty("right")) {
                                this.topRightCornerRound = v["right"];
                            }
                        }
                    }
                    else {
                        this.topLeftCornerRound = v;
                        this.topRightCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        left: this.topLeftCornerRound,
                        right: this.topRightCornerRound
                    };
                }
            },
            bottomCornerRound: {
                type: verticalCornerRoundType,
                setter: function (v) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            this.bottomLeftCornerRound = v[0];
                            this.bottomRightCornerRound = v[1];
                        }
                        else {
                            if (v.hasOwnProperty("left")) {
                                this.bottomLeftCornerRound = v["left"];
                            }
                            if (v.hasOwnProperty("right")) {
                                this.bottomRightCornerRound = v["right"];
                            }
                        }
                    }
                    else {
                        this.bottomLeftCornerRound = v;
                        this.bottomRightCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        left: this.bottomLeftCornerRound,
                        right: this.bottomRightCornerRound
                    };
                }
            },
            leftCornerRound: {
                type: horizontalCornerRoundType,
                setter: function (v, set) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            v.topLeftCornerRound = v[0];
                            v.bottomLeftCornerRound = v[1];
                        }
                        else {
                            if (v.hasOwnProperty("top")) {
                                this.topLeftCornerRound = v["top"];
                            }
                            if (v.hasOwnProperty("bottom")) {
                                this.bottomLeftCornerRound = v["bottom"];
                            }
                        }
                    }
                    else {
                        this.topLeftCornerRound = v;
                        this.bottomLeftCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        top: this.topLeftCornerRound,
                        bottom: this.bottomLeftCornerRound
                    };
                }
            },
            rightCornerRound: {
                type: horizontalCornerRoundType,
                setter: function (v, set) {
                    if (typeof v === 'object') {
                        if (v instanceof Array) {
                            v.topRightCornerRound = v[0];
                            v.bottomRightCornerRound = v[1];
                        }
                        else {
                            if (v.hasOwnProperty("top")) {
                                this.topRightCornerRound = v["top"];
                            }
                            if (v.hasOwnProperty("bottom")) {
                                this.bottomRightCornerRound = v["bottom"];
                            }
                        }
                    }
                    else {
                        this.topRightCornerRound = v;
                        this.bottomRightCornerRound = v;
                    }
                    return this;
                },
                getter: function () {
                    return {
                        top: this.topRightCornerRound,
                        bottom: this.bottomRightCornerRound
                    };
                }
            }
        }, []);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.cornerRound = cornerRound;
    }

    setTopLeftCornerRound(cornerRound) {
        this.topLeftCornerRound = cornerRound;
        return this;
    }
    setTopRightCornerRound(cornerRound) {
        this.topRightCornerRound = cornerRound;
        return this;
    }
    setBottomLeftCornerRound(cornerRound) {
        this.bottomLeftCornerRound = cornerRound;
        return this;
    }
    setBottomRightCornerRound(cornerRound) {
        this.bottomRightCornerRound = cornerRound;
        return this;
    }

    setCornerRound() {
        if (arguments.length > 1) {
            this.cornerRound = [...arguments];
        }
        else {
            this.cornerRound = arguments[0];
        }
        return this;
    }
    setTopCornerRound() {
        if (arguments.length > 1) {
            this.topCornerRound = [...arguments];
        }
        else {
            this.topCornerRound = arguments[0];
        }
        return this;
    }
    setBottomCornerRound() {
        if (arguments.length > 1) {
            this.bottomCornerRound = [...arguments];
        }
        else {
            this.bottomCornerRound = arguments[0];
        }
        return this;
    }
    setLeftCornerRound() {
        if (arguments.length > 1) {
            this.leftCornerRound = [...arguments];
        }
        else {
            this.leftCornerRound = arguments[0];
        }
        return this;
    }
    setRightCornerRound() {
        if (arguments.length > 1) {
            this.rightCornerRound = [...arguments];
        }
        else {
            this.rightCornerRound = arguments[0];
        }
        return this;
    }

    draw(ctx) {
        super.draw(ctx);

        var maxRound = Math.min(this.height / 2, this.width / 2);
        this.topLeftCornerRound = Math.min(this.topLeftCornerRound, maxRound);
        this.topRightCornerRound = Math.min(this.topRightCornerRound, maxRound);
        this.bottomLeftCornerRound = Math.min(this.bottomLeftCornerRound, maxRound);
        this.bottomRightCornerRound = Math.min(this.bottomRightCornerRound, maxRound);

        var topLeft = this.x + this.topLeftCornerRound;
        var topRight = this.x + this.width - this.topRightCornerRound;
        var rightTop = this.y + this.topRightCornerRound;
        var rightBottom = this.y + this.height - this.bottomRightCornerRound;
        var bottomRight = this.x + this.width - this.bottomRightCornerRound;
        var bottomLeft = this.x + this.bottomLeftCornerRound;
        var leftBottom = this.y + this.height - this.bottomLeftCornerRound;
        var leftTop = this.y + this.topLeftCornerRound;

        ctx.beginPath();
        ctx.moveTo(topLeft, this.y);
        ctx.lineTo(topRight, this.y);
        ctx.arc(topRight, rightTop, this.topRightCornerRound, -Math.PI / 2, 0);
        ctx.lineTo(this.x + this.width, rightBottom);
        ctx.arc(bottomRight, rightBottom, this.bottomRightCornerRound, 0, Math.PI / 2);
        ctx.lineTo(bottomLeft, this.y + this.height);
        ctx.arc(bottomLeft, leftBottom, this.bottomLeftCornerRound, Math.PI / 2, Math.PI);
        ctx.lineTo(this.x, leftTop);
        ctx.arc(leftTop, topLeft, this.topLeftCornerRound, Math.PI, Math.PI * 3 / 2);
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
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            cornerRound: this.cornerRound
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

export default Rectangle;