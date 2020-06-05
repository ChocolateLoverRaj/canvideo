import canvas = require('canvas');

import Camera = require("./camera-class");
import setColor = require("./color/set");
import GetColor = require("./color/get");

declare interface AddOptions {
    startTime?: number;
    duration?: number;
    layer?: number;
}

declare interface Drawable {
    at: (frameNumber: number) => {
        draw: (ctx: canvas.CanvasRenderingContext2D) => any;
    };
}

declare interface RenderOptions {
    width: number;
    height: number;
}

declare class Scene {
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

    setDuration(duration: number): this;
}

export = Scene;