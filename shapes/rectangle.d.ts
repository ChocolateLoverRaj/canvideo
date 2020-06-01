import canvas = require('canvas');

import Shape = require("./shape");

class Rectangle extends Shape<Rectangle>{
    constructor(x: number, y: number, width: number, height: number);

    x: number;
    y: number;
    width: number;
    height: number;

    draw(ctx: canvas.CanvasRenderingContext2D): this;
}

export = Rectangle;