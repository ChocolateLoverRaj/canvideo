import canvas = require('canvas');

import Animanaged = require("../animanage/animanaged");
import params = require("../animanage/params");
import setColor = require("../render/color/set");
import GetColor = require("../render/color/get");

declare class Shape<T extends Shape> extends Animanaged<T>{
    constructor(properties: params.Properties, methodsToBind: params.methods);

    set fillColor(color: setColor): this;
    get fillColor(): GetColor;

    set strokeColor(color: setColor): this;
    get strokeColor(): GetColor;

    strokeWidth: number;

    fill(color: setColor): this;
    stroke(color: setColor, width?: number): this;
    draw(ctx: canvas.CanvasRenderingContext2D): this;
}

export = Shape;