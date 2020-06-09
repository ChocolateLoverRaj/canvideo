import Drawable from "../render/drawable";
import Shape from "./shape";
import MyCtx from "../render/my-ctx";

declare class Group extends Shape<Group>{
    constructor(x?: number, y?: number, originalWidth?: number, originalHeight?: number, refX?: number, refY?: number);

    children: Array<Drawable>;
    x: number;
    y: number;
    originalWidth: number;
    originalHeight: number;
    refX: number;
    refY: number;
    width: number;
    height: number;

    setX(x: number): this;
    setY(y: number): this;
    setPosition(x: number, y: number): this;
    setPosition(position: { x: number, y: number }): this;
    setPosition(position: [number, number]): this;

    setOriginalWidth(width: number): this;
    setOriginalHeight(height: number): this;
    setOriginalSize(width: number, height: number): this;
    setOriginalSize(size: { width: number, height: number }): this;
    setOriginalSize(size: [number, number]): this;

    setRefX(x: number): this;
    setRefY(y: number): this;
    setRef(x: number, y: number): this;
    setRef(position: { x: number, y: number }): this;
    setRef(position: [number, number]): this;

    setWidth(width: number): this;
    setHeight(height: number): this;
    setSize(width: number, height: number): this;
    setSize(size: { width: number, height: number }): this;
    setSize(size: [number, number]): this;

    add(drawable: Drawable): this;

    draw(ctx: MyCtx): this;
}

export = Group;