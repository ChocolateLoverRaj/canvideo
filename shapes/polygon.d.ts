import { CanvasRenderingContext2D } from 'canvas';

import { Shape, ShapeProperties, ShapeJson } from "./shape";

declare interface PolygonProperties extends ShapeProperties<PolygonProperties> {
    points: Array<Point>;
}

declare interface PolygonJson extends ShapeJson<PolygonProperties> {
    points: Array<Point>;
}

declare interface Point {
    x: number;
    y: number;
}

declare class Polygon extends Shape<Polygon>{
    constructor(...xyList: Array<number>);
    constructor(...xyPair: Array<[number, number]>);
    constructor(...points: Array<Point>);

    points: Array<Point>;

    draw(ctx: CanvasRenderingContext2D): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): PolygonJson;
}

export = Polygon;