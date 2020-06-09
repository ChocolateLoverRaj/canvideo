import MyCtx from "../render/my-ctx";
import Shape from "./shape";

declare class Circle extends Shape<Circle> {
    constructor(cx: number, cy: number, r: number);

    cx: number;
    cy: number;
    r: number;

    draw(ctx: MyCtx): this;
}

export = Circle;