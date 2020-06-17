import { PNGStream } from "canvas";

import Drawable from "./drawable";
import Camera from "./camera";
import setColor from "./color/set";
import GetColor from "./color/get";

declare interface AddOptions {
    startTime?: number;
    duration?: number;
    layer?: number;
}

declare interface RenderOptions {
    width: number;
    height: number;
}

export default class Scene {
    constructor();

    drawables: Array<Drawable>;
    camera: Camera;
    duration: number;
    readonly autoDuration: number;

    add(drawable: Drawable): this;
    add(startTime: number, drawable: Drawable): this;
    add(startTime: number, duration: number, drawable: Drawable): this;
    add(startTime: number, duration: number, layer: number, drawable: Drawable): this;
    add(addOptions: AddOptions, drawable: Drawable): this;

    set backgroundColor(color: setColor): this;
    get backgroundColor(): GetColor;

    setBackgroundColor(color: setColor): this;

    setCamera(camera: Camera): this;

    render(at: number, options: RenderOptions): string;

    setDuration(duration: number): PNGStream;

    toJson(stringify?: true): string;
    toJson(stringify: false): object;
}