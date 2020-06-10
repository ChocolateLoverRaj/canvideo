import MyCtx from "../render/my-ctx";
import Shape from "./shape";

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
declare type setCornerRound = number | SetCornerRound | Array<number> & {length: 4};

declare interface SetVerticalCornerRound{
    left?: number;
    right?: number;
}
declare interface GetVerticalCornerRound{
    left: number;
    right: number;
}
declare type setVerticalCornerRound = number | SetVerticalCornerRound | Array<number> & {length: 2};

declare interface SetHorizontalCornerRound{
    top?: number;
    bottom?: number;
}
declare interface GetHorizontalCornerRound{
    top: number;
    bottom: number;
}
declare type setHorizontalCornerRound = number | SetHorizontalCornerRound | Array<number> & {length: 2};

declare class Rectangle extends Shape<Rectangle>{
    constructor(x: number, y: number, width: number, height: number, cornerRound?: number);

    x: number;
    y: number;
    width: number;
    height: number;

    topLeftCornerRound: number;
    topRightCornerRound: number;
    bottomLeftCornerRound: number;
    bottomRightCornerRound: number;

    set cornerRound(cornerRound: setCornerRound): this;
    get cornerRound(): GetCornerRound;
    set topCornerRound(cornerRound: setVerticalCornerRound): this;
    get topCornerRound(): GetVerticalCornerRound;
    set bottomCornerRound(cornerRound: setVerticalCornerRound): this;
    get bottomCornerRound(): GetVerticalCornerRound;
    set leftCornerRound(cornerRound: setHorizontalCornerRound): this;
    get leftCornerRound(): GetHorizontalCornerRound;
    set rightCornerRound(cornerRound: setHorizontalCornerRound): this;
    get rightCornerRound(): GetHorizontalCornerRound;

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
}

export = Rectangle;