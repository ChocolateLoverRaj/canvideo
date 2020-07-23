import { Shape, ShapeProperties, ShapeJson } from "./shape";
import { caMappings } from "../animations/animanaged";

interface CircleProperties extends ShapeProperties {
    cx: number;
    cy: number;
    r: number;
}

interface CircleJson extends ShapeJson<CircleProperties> {
    cx: number;
    cy: number;
    r: number;
}

type circleCaMappings = caMappings<CircleProperties>;

declare class Circle extends Shape<Circle, CircleProperties> {
    static shapeName: string | "circle";

    static fromJson(json: string, parse?: true, throwErrors?: false, caMappings?: circleCaMappings): Circle | false;
    static fromJson(json: any, parse: false, throwErrors?: false, caMappings?: circleCaMappings): Circle | false;
    static fromJson(json: string, parse: true, throwErrors: true, caMappings?: circleCaMappings): Circle;
    static fromJson(json: any, parse: false, throwErrors: true, caMappings?: circleCaMappings): Circle;

    static fromJson(...args: any): any;

    constructor(cx: number, cy: number, r: number);

    shapeName: string | "circle";
    cx: number;
    cy: number;
    r: number;

    setCx(cx: number): this;
    setCy(cy: number): this;
    setC(x: number, y: number): this;
    setC(c: { x: number, y: number }): this;
    setC(c: [number, number]): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): CircleJson;

    toJson(...args: any): any;
}

export = Circle;