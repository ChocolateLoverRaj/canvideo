import { CanvasRenderingContext2D as Ctx } from "canvas";

import Animanaged from "../animations/animanaged";
import { properties, methods } from "../properties/properties";
import { GetColor, setColor } from "../color";
import { caMappings } from "../animations/animanaged";
import { ShapeJson, ShapeProperties } from "./shape-properties";

type sam = caMappings<ShapeProperties>;
type generalShape = Shape<any, ShapeProperties>;

declare class Shape<T extends Shape<any, any>, P extends {}> extends Animanaged<T, ShapeProperties & P>{
    static shapeName: string | "shape";

    static fromJson<S extends Shape<any, any>>(json: string, parse?: true, throwErrors?: false, caMappings?: sam, shape?: S): [S, object] | false;
    static fromJson<S extends Shape<any, any>>(json: any, parse: false, throwErrors?: false, caMappings?: sam, shape?: S): [S, object] | false;
    static fromJson<S extends Shape<any, any>>(json: string, parse?: true, throwErrors?: true, caMappings?: sam, shape?: S): [S, object];
    static fromJson<S extends Shape<any, any>>(json: any, parse: false, throwErrors: true, caMappings?: sam, shape?: S): [S, object];
    static fromJson(json: string, parse?: true, throwErrors?: false, caMappings?: sam): generalShape | false;
    static fromJson(json: any, parse: false, throwErrors?: false, caMappings?: sam): generalShape | false;
    static fromJson(json: string, parse?: true, throwErrors?: true, caMappings?: sam): generalShape;
    static fromJson(json: any, parse: false, throwErrors: true, caMappings?: sam): generalShape;

    static fromJson(...args: any): any;

    constructor(properties: properties, methodsToBind: methods);

    shapeName: string | "shape";
    fillColor: setColor | GetColor;
    strokeColor: setColor | GetColor;
    strokeWidth: number;

    fill(color: setColor): this;
    stroke(color: setColor, width?: number): this;
    draw(ctx: Ctx): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): ShapeJson<ShapeProperties>;

    toJson(...args: any): any;
}

export default Shape;