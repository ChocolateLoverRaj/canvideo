import typedFunction from "../type/typed-function.js";
import Types from "../type/types.js";

export const createCanvas = typedFunction([
    { name: "width", type: Types.POSITIVE_INTEGER },
    { name: "height", type: Types.POSITIVE_INTEGER }
], (width, height) => canvas.createCanvas(width, height));

export const Ctx = CanvasRenderingContext2D;