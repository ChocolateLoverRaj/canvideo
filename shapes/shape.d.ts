import MyCtx from "../render/my-ctx";
import Animanaged from "../animations/animanaged";
import { properties, methods } from "../properties/properties";
import { GetColor, setColor } from "../color";

declare class Shape<T extends Shape<T>> extends Animanaged<T>{
    constructor(properties: properties, methodsToBind: methods);

    readonly fillColor: GetColor;
    readonly strokeColor: GetColor;

    strokeWidth: number;

    fill(color: setColor): this;
    stroke(color: setColor, width?: number): this;
    draw(ctx: MyCtx): this;
}

export = Shape;