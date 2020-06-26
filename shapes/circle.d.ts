import MyCtx from "../render/my-ctx";
import { Shape, ShapeProperties, ShapeJson } from "./shape";

declare interface CircleProperties extends ShapeProperties<CircleProperties> {
    cx: number;
    cy: number;
    r: number;
}

declare interface CircleJson extends ShapeJson<CircleProperties> {
    cx: number;
    cy: number;
    r: number;
}


declare class Circle extends Shape<Circle, CircleProperties> {
    static shapeName: "circle";

    static fromJson(json: string, parse?: true, throwErrors?: false): Circle | false;
    static fromJson(json: any, parse: false, throwErrors?: false): Circle | false;
    static fromJson(json: string, parse?: true, throwErrors: true): Circle;
    static fromJson(json: any, parse: false, throwErrors: true): Circle;

    constructor(cx: number, cy: number, r: number);

    shapeName: "circle";
    cx: number;
    cy: number;
    r: number;

    setCx(cx: number): this;
    setCy(cy: number): this;
    setC(x: number, y: number): this;
    setC(c: { x: number, y: number }): this;
    setC(c: [number, number]): this;

    draw(ctx: MyCtx): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): CircleJson;
}

export = Circle;