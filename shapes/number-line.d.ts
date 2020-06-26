import { Shape, ShapeProperties, ShapeJson } from "./shape";

declare interface NumberLineProperties extends ShapeProperties<NumberLineProperties> {
    startNumber: number;
    endNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

declare interface NumberLineJson extends ShapeJson<NumberLineProperties> {
    startNumber: number;
    endNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

declare class NumberLine extends Shape<NumberLine, NumberLineProperties>{
    static shapeName: "numberLine";

    static fromJson(json: string, parse?: true, throwErrors?: false): NumberLine | false;
    static fromJson(json: any, parse: false, throwErrors?: false): NumberLine | false;
    static fromJson(json: string, parse?: true, throwErrors: true): NumberLine;
    static fromJson(json: any, parse: false, throwErrors: true): NumberLine;

    constructor(startNumber: number, endNumber: number, x: number, y: number, width: number, height: number);

    shapeName: "numberLine";
    startNumber: number;
    endNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;

    setX(x: number): this;
    setY(y: number): this;
    setPosition(x: number, y: number): this;
    setPosition(position: { x: number, y: number }): this;
    setPosition(position: [number, number]): this;

    coordinateAt(n: number): { x: number, y: number };

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): NumberLineJson;
}

export = NumberLine;