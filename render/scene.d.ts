import { PNGStream } from "canvas";

import { default as Shape } from "./drawable";
import Camera from "./camera";
import setColor from "./color/set";
import GetColor from "./color/get";

declare interface Drawable {
    startTime: number;
    endTime: number;
    layer: number;
    shape: Shape;
}

declare interface AddOptions {
    startTime?: number;
    duration?: number;
    layer?: number;
}

declare interface RenderOptions {
    width: number;
    height: number;
}

declare interface DrawableJson {
    startTime: number;
    endTime: number;
    layer: number;
    shape: {
        name: string | undefined;
        data: object;
    }
}

export declare interface SceneJson {
    backgroundColor: string;
    drawables: Array<DrawableJson>;
}

export declare class Scene {
    constructor();

    drawables: Array<Drawable>;
    camera: Camera;
    duration: number;
    readonly autoDuration: number;

    add(drawable: Shape): this;
    add(startTime: number, drawable: Shape): this;
    add(startTime: number, duration: number, drawable: Shape): this;
    add(startTime: number, duration: number, layer: number, drawable: Shape): this;
    add(addOptions: AddOptions, drawable: Shape): this;

    set backgroundColor(color: setColor): this;
    get backgroundColor(): GetColor;

    setBackgroundColor(color: setColor): this;

    setCamera(camera: Camera): this;

    render(at: number, options: RenderOptions): PNGStream;

    setDuration(duration: number): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): SceneJson;
}

export default Scene;