import {CanvasRenderingContext2D} from 'canvas';

import Shape from "./shape";

declare interface Point{
    x: number;
    y: number;
}

export default class Polygon extends Shape<Polygon>{
    constructor(...xyList: Array<number>);
    constructor(...xyPair: Array<[number, number]>);
    constructor(...points: Array<Point>);

    points: Array<Point>;

    draw(ctx: CanvasRenderingContext2D): this;
}