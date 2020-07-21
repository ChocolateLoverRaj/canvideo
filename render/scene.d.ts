import { Canvas } from "canvas";

import Shape from "../shapes/shape";
import Camera from "./camera";
import setColor from "./color/set";
import GetColor from "./color/get";
import csMappings from "../shapes/cs-mappings";
import { caMappings } from "../animations/animanaged";
import Caption from "../caption";

declare type shape = Shape<any, any>;

declare interface Drawable {
    startTime: number;
    endTime: number;
    layer: number;
    shape: shape;
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
        isBuiltin: boolean;
        name: string | undefined;
        data: object;
    }
}

export declare interface SceneJson {
    backgroundColor: string;
    drawables: Array<DrawableJson>;
}

export declare class Scene {
    static fromJson(json: string, parse?: true, throwErrors?: false, csMappings?: csMappings, caMappings?: caMappings): Scene | false;
    static fromJson(json: string, parse?: true, throwErrors: true, csMappings?: csMappings, caMappings?: caMappings): Scene;
    static fromJson(json: any, parse: false, throwErrors?: false, csMappings?: csMappings, caMappings?: caMappings): Scene | false;
    static fromJson(json: any, parse: false, throwErrors: true, csMappings?: csMappings, caMappings?: caMappings): Scene;

    constructor();

    drawables: Array<Drawable>;
    camera: Camera;
    duration: number;
    readonly autoDuration: number;

    add(drawable: shape): this;
    add(startTime: number, drawable: shape): this;
    add(startTime: number, duration: number, drawable: shape): this;
    add(startTime: number, duration: number, layer: number, drawable: shape): this;
    add(addOptions: AddOptions, drawable: shape): this;

    add(caption: Caption): this;
    add(id: string, caption: Caption): this;

    set backgroundColor(color: setColor): this;
    get backgroundColor(): GetColor;

    setBackgroundColor(color: setColor): this;

    setCamera(camera: Camera): this;

    render(at: number, options: RenderOptions): Canvas;

    setDuration(duration: number): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): SceneJson;
}

export default Scene;