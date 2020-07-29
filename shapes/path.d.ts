import Shape from "./shape";
import { ShapeProperties, ShapeJson } from "./shape-properties";
import { caMappings } from "../animations/animanaged";

interface PathProperties extends ShapeProperties {
    doFill: boolean;
    strokeDash: Array<number>;
    strokeDashOffset: number;
    operations: Array<[string, Array<string>]>;
}

interface PathJson extends ShapeJson<PathProperties> {
    doFill: boolean;
    strokeDash: Array<number>;
    strokeDashOffset: number;
    operations: Array<[string, Array<string>]>;
}

type pathCaMappings = caMappings<PathProperties>;

declare class Path extends Shape<Path, PathProperties>{
    static shapeName: string | "path";

    static fromJson(json: string, parse?: true, throwErrors?: false, caMappings?: pathCaMappings): Path | false;
    static fromJson(json: any, parse: false, throwErrors?: false, caMappings?: pathCaMappings): Path | false;
    static fromJson(json: string, parse: true, throwErrors: true, caMappings?: pathCaMappings): Path;
    static fromJson(json: any, parse: false, throwErrors: true, caMappings?: pathCaMappings): Path;
    
    static fromJson(...args: any): any;

    constructor(fill?: boolean);

    shapeName: string | "path";
    doFill: boolean;
    strokeDash: Array<number>;
    strokeDashOffset: number;
    operations: Array<[string, Array<string>]>;

    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, antiClockwise?: boolean): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): PathJson;
    
    toJson(...args: any): any;
}

export default Path;