import MyCtx from "../render/my-ctx";
import Animanaged from "../properties/animanage/animanaged";
import params from "../properties/animanage/params";
import setColor from "../render/color/set";
import GetColor from "../render/color/get";

declare class Shape<T extends Shape> extends Animanaged<T>{
    constructor(properties: params.Properties, methodsToBind: params.methods);

    set fillColor(color: setColor): this;
    get fillColor(): GetColor;

    set strokeColor(color: setColor): this;
    get strokeColor(): GetColor;

    strokeWidth: number;

    fill(color: setColor): this;
    stroke(color: setColor, width?: number): this;
    draw(ctx: MyCtx): this;
}

export = Shape;