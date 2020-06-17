import MyCtx from "../render/my-ctx";
import Shape from "./shape";

declare class Circle extends Shape<Circle> {
    constructor(cx: number, cy: number, r: number);

    cx: number;
    cy: number;
    r: number;

    setCx(cx: number): this;
    setCy(cy: number): this;
    setC(x: number, y: number): this;
    setC(c: { x: number, y: number }): this;
    setC(c: [number, number]): this;

    draw(ctx: MyCtx): this;
}

export = Circle;