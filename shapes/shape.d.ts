import canvas = require('canvas');

import Animanaged = require("../animanaged");

declare interface SetColor{
    r?: number;
    g?: number;
    b?: number;
    a?: number;
}
declare type setColor = SetColor | string;

declare interface GetColor{
    r: number;
    g: number;
    b: number;
    a: number;
    hexString: string;
}

declare class Shape extends Animanaged<Shape>{
    constructor();

    set fillColor(color: setColor): this;
    get fillColor(): GetColor;

    set strokeColor(color: setColor): this;
    get strokeColor(): GetColor;

    strokeWidth: number;

    draw(ctx: canvas.CanvasRenderingContext2D): this;
}

export = Shape;