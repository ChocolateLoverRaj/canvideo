import canvas = require('canvas');

import Camera = require("./camera-class");

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
    fps: number;
    width: number;
    height: number;
}

declare class Scene {
    constructor();

    drawables: Array<Drawable>;
    camera: Camera;

    add(drawable: Drawable): this;
    add(startTime: number, drawable: Drawable): this;
    add(startTime: number, duration: number, drawable: Drawable): this;
    add(startTime: number, duration: number, layer: number, drawable: Drawable): this;
    add(addOptions: AddOptions, drawable: Drawable): this;

    setCamera(camera: Camera): this;

    render(frameNumber: number, options: RenderOptions): this;
}

export = Scene;