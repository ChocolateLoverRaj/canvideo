import {CanvasRenderingContext2D} from 'canvas';

import Drawable from "../render/drawable";
import Shape from "./shape";

declare class Group extends Shape<Group>{
    constructor();

    children: Array<Drawable>;

    add(drawable: Drawable): this;

    draw(ctx: CanvasRenderingContext2D): this;
}

export = Group;