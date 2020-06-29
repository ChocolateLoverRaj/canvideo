import MyCtx from "../render/my-ctx";
import { Shape, ShapeProperties, ShapeJson } from "./shape";
import { caMappings } from "../animations/animanaged";

declare interface RectangleProperties extends ShapeProperties<RectangleProperties> {
    x: number;
    y: number;
    width: number;
    height: number;

    topLeftCornerRound: number;
    topRightCornerRound: number;
    bottomLeftCornerRound: number;
    bottomRightCornerRound: number;

    cornerRound: setCornerRound | GetCornerRound;
    topCornerRound: setVerticalCornerRound | GetVerticalCornerRound;
    bottomCornerRound: setVerticalCornerRound | GetVerticalCornerRound;
    leftCornerRound: setHorizontalCornerRound | GetHorizontalCornerRound;
    rightCornerRound: setHorizontalCornerRound | GetHorizontalCornerRound;
}

declare interface RectangleJson extends ShapeJson<RectangleProperties> {
    x: number;
    y: number;
    width: number;
    height: number;
    cornerRound: GetCornerRound;
}

declare interface SetCornerRound {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
}
declare interface GetCornerRound {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
}
declare type setCornerRound = number | SetCornerRound | Array<number> & { length: 4 };

declare interface SetVerticalCornerRound {
    left?: number;
    right?: number;
}
declare interface GetVerticalCornerRound {
    left: number;
    right: number;
}
declare type setVerticalCornerRound = number | SetVerticalCornerRound | Array<number> & { length: 2 };

declare interface SetHorizontalCornerRound {
    top?: number;
    bottom?: number;
}
declare interface GetHorizontalCornerRound {
    top: number;
    bottom: number;
}
declare type setHorizontalCornerRound = number | SetHorizontalCornerRound | Array<number> & { length: 2 };

declare type rectangleCaMappings = caMappings<RectangleProperties>;

declare class Rectangle extends Shape<Rectangle>{
    static shapeName: "rectangle";

    static fromJson(json: string, parse?: true, throwErrors?: false, caMappings?: rectangleCaMappings): Rectangle | false;
    static fromJson(json: any, parse: false, throwErrors?: false, caMappings?: rectangleCaMappings): Rectangle | false;
    static fromJson(json: string, parse?: true, throwErrors: true, caMappings?: rectangleCaMappings): Rectangle;
    static fromJson(json: any, parse: false, throwErrors: true, caMappings?: rectangleCaMappings): Rectangle;

    constructor(x: number, y: number, width: number, height: number, cornerRound?: setCornerRound);

    shapeName: "rectangle";

    x: number;
    y: number;
    width: number;
    height: number;

    topLeftCornerRound: number;
    topRightCornerRound: number;
    bottomLeftCornerRound: number;
    bottomRightCornerRound: number;

    cornerRound: setCornerRound | GetCornerRound;
    topCornerRound: setVerticalCornerRound | GetVerticalCornerRound;
    bottomCornerRound: setVerticalCornerRound | GetVerticalCornerRound;
    leftCornerRound: setHorizontalCornerRound | GetHorizontalCornerRound;
    rightCornerRound: setHorizontalCornerRound | GetHorizontalCornerRound;

    setTopLeftCornerRound(cornerRound: number): this;
    setTopRightCornerRound(cornerRound: number): this;
    setBottomLeftCornerRound(cornerRound: number): this;
    setBottomRightCornerRound(cornerRound: number): this;

    setCornerRound(cornerRound: setCornerRound): this;
    setTopCornerRound(cornerRound: setVerticalCornerRound): this;
    setBottomCornerRound(cornerRound: setVerticalCornerRound): this;
    setLeftCornerRound(cornerRound: setHorizontalCornerRound): this;
    setRightCornerRound(cornerRound: setHorizontalCornerRound): this;

    draw(ctx: MyCtx): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): RectangleJson;
}

export = Rectangle;