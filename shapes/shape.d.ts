import MyCtx from "../render/my-ctx";
import { Animanaged, AnimationJson, SetJson } from "../animations/animanaged";
import { properties, methods } from "../properties/properties";
import { GetColor, setColor } from "../color";

export declare interface ShapeJson<P extends {}> {
    fillColor: string | undefined;
    strokeColor: string | undefined;
    strokeWidth: number | undefined;
    animations: Array<AnimationJson>;
    sets: Array<SetJson<P>>;
}

export declare interface ShapeProperties<P extends {}> extends P {
    fillColor: setColor | GetColor | undefined;
    strokeColor: setColor | GetColor | undefined;
    strokeWidth: number | undefined;
}

export declare class Shape<T extends Shape<T>, P> extends Animanaged<T, ShapeProperties<P>>{
    static shapeName: "shape";

    static fromJson<S extends Shape<any, any>>(json: string, parse?: true, throwErrors?: false, shape: S): [S, object] | false;
    static fromJson<S extends Shape<any, any>>(json: any, parse: false, throwErrors?: false, shape: S): [S, object] | false;
    static fromJson<S extends Shape<any, any>>(json: string, parse?: true, throwErrors: true, shape: S): [S, object];
    static fromJson<S extends Shape<any, any>>(json: any, parse: false, throwErrors: true, shape: S): [S, object];
    static fromJson(json: string, parse?: true, throwErrors?: false): Shape<Shape, ShapeProperties<{}>> | false;
    static fromJson(json: any, parse: false, throwErrors?: false): Shape<Shape, ShapeProperties<{}>> | false;
    static fromJson(json: string, parse?: true, throwErrors: true): Shape<Shape, ShapeProperties<{}>>;
    static fromJson(json: any, parse: false, throwErrors: true): Shape<Shape, ShapeProperties<{}>>;

    constructor(properties: properties, methodsToBind: methods);

    shapeName: "shape";
    fillColor: setColor | GetColor;
    strokeColor: setColor | GetColor;
    strokeWidth: number;

    fill(color: setColor): this;
    stroke(color: setColor, width?: number): this;
    draw(ctx: MyCtx): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): ShapeJson<ShapeProperties>;
}

export default Shape;