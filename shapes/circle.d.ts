import { CanvasRenderingContext2D } from 'canvas';

import Shape from "./shape";

declare class Circle extends Shape {
    constructor(cx: number, cy: number, r: number);

    cx: number;
    cy: number;
    r: number;

    draw(ctx: CanvasRenderingContext2D): this;
}

export = Circle;