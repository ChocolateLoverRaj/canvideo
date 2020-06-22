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
    constructor(properties: properties, methodsToBind: methods);

    readonly fillColor: GetColor;
    readonly strokeColor: GetColor;

    strokeWidth: number;

    fill(color: setColor): this;
    stroke(color: setColor, width?: number): this;
    draw(ctx: MyCtx): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): ShapeJson<ShapeProperties>;
}

export default Shape;