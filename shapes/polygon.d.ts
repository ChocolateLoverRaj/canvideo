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
    static shapeName: "polygon";

    static fromJson(json: string, parse?: true, throwErrors?: false): Polygon | false;
    static fromJson(json: any, parse: false, throwErrors?: false): Polygon | false;
    static fromJson(json: string, parse?: true, throwErrors: true): Polygon;
    static fromJson(json: any, parse: false, throwErrors: true): Polygon;

    constructor(...xyList: Array<number>);
    constructor(...xyPair: Array<[number, number]>);
    constructor(...points: Array<Point>);

    shapeName: "polygon";
    points: Array<Point>;

    draw(ctx: CanvasRenderingContext2D): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): PolygonJson;
}

export = Polygon;