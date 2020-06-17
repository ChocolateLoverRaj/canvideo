import MyCtx from "../render/my-ctx";
import Shape from "./shape";

export default class Circle extends Shape<Circle> {
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