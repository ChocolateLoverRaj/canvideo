import { Shape, ShapeProperties, ShapeJson } from "./shape";
import { caMappings } from "../animations/animanaged";

interface NumberLineProperties extends ShapeProperties {
    startNumber: number;
    endNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface NumberLineJson extends ShapeJson<NumberLineProperties> {
    startNumber: number;
    endNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

type numberLineCaMappings = caMappings<NumberLineProperties>;

declare class NumberLine extends Shape<NumberLine, NumberLineProperties>{
    static shapeName: string | "numberLine";

    static fromJson(json: string, parse?: true, throwErrors?: false, caMappings?: numberLineCaMappings): NumberLine | false;
    static fromJson(json: any, parse: false, throwErrors?: false, caMappings?: numberLineCaMappings): NumberLine | false;
    static fromJson(json: string, parse: true, throwErrors: true, caMappings?: numberLineCaMappings): NumberLine;
    static fromJson(json: any, parse: false, throwErrors: true, caMappings?: numberLineCaMappings): NumberLine;

    static fromJson(...args: any): any;

    constructor(startNumber: number, endNumber: number, x: number, y: number, width: number, height: number);

    shapeName: string | "numberLine";
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
    
    toJson(...args: any): any;
}

export = NumberLine;