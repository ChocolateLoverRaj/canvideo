import { Shape, ShapeProperties, ShapeJson } from "./shape";

declare interface PathProperties extends ShapeProperties<PathProperties> {
    doFill: boolean;
    strokeDash: Array<number>;
    strokeDashOffset: number;
    operations: Array<[string, Array<string>]>;
}

declare interface PathJson extends ShapeJson<PathProperties> {
    doFill: boolean;
    strokeDash: Array<number>;
    strokeDashOffset: number;
    operations: Array<[string, Array<string>]>;
}

declare class Path extends Shape<Path>{
    constructor(fill?: boolean);

    doFill: boolean;
    strokeDash: Array<number>;
    strokeDashOffset: number;
    operations: Array<[string, Array<string>]>;

    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, antiClockwise?: boolean): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): PathJson;
}

export = Path;