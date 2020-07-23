import { Shape, ShapeProperties, ShapeJson } from "./shape";
import { caMappings } from "../animations/animanaged";

interface RectangleProperties extends ShapeProperties {
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

interface RectangleJson extends ShapeJson<RectangleProperties> {
    x: number;
    y: number;
    width: number;
    height: number;
    cornerRound: GetCornerRound;
}

interface SetCornerRound {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
}
interface GetCornerRound {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
}
type setCornerRound = number | SetCornerRound | Array<number> & { length: 4 };

interface SetVerticalCornerRound {
    left?: number;
    right?: number;
}
interface GetVerticalCornerRound {
    left: number;
    right: number;
}
type setVerticalCornerRound = number | SetVerticalCornerRound | Array<number> & { length: 2 };

interface SetHorizontalCornerRound {
    top?: number;
    bottom?: number;
}
interface GetHorizontalCornerRound {
    top: number;
    bottom: number;
}
type setHorizontalCornerRound = number | SetHorizontalCornerRound | Array<number> & { length: 2 };

type rectangleCaMappings = caMappings<RectangleProperties>;

declare class Rectangle extends Shape<Rectangle, RectangleProperties>{
    static shapeName: string | "rectangle";

    static fromJson(json: string, parse?: true, throwErrors?: false, caMappings?: rectangleCaMappings): Rectangle | false;
    static fromJson(json: any, parse: false, throwErrors?: false, caMappings?: rectangleCaMappings): Rectangle | false;
    static fromJson(json: string, parse: true, throwErrors: true, caMappings?: rectangleCaMappings): Rectangle;
    static fromJson(json: any, parse: false, throwErrors: true, caMappings?: rectangleCaMappings): Rectangle;

    static fromJson(...args: any): any;

    constructor(x: number, y: number, width: number, height: number, cornerRound?: setCornerRound);

    shapeName: string | "rectangle";

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

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): RectangleJson;
    
    toJson(...args: any): any;
}

export = Rectangle;