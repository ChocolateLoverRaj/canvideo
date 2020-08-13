import Shape from "./shape";
import { ShapeProperties, ShapeJson } from "./shape-properties";
import { caMappings } from "../animations/animanaged";

interface PolygonProperties extends ShapeProperties {
    points: Array<Point>;
}

interface PolygonJson extends ShapeJson<PolygonProperties> {
    points: Array<Point>;
}

interface Point {
    x: number;
    y: number;
}

type polygonCaMappings = caMappings<PolygonProperties>;

declare class Polygon extends Shape<Polygon, PolygonProperties>{
    static shapeName: string | "polygon";

    static fromJson(json: string, parse?: true, throwErrors?: false, caMappings?: polygonCaMappings): Polygon | false;
    static fromJson(json: any, parse: false, throwErrors?: false, caMappings?: polygonCaMappings): Polygon | false;
    static fromJson(json: string, parse: true, throwErrors: true, caMappings?: polygonCaMappings): Polygon;
    static fromJson(json: any, parse: false, throwErrors: true, caMappings?: polygonCaMappings): Polygon;

    static fromJson(...args: any): any;

    constructor(...xyList: Array<number>);
    constructor(...xyPair: Array<[number, number]>);
    constructor(...points: Array<Point>);

    shapeName: string | "polygon";
    points: Array<Point>;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): PolygonJson;

    toJson(...args: any): any;
}

export default Polygon;