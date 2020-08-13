import { CanvasRenderingContext2D } from "canvas";

import Shape from "../shapes/shape";
import { ShapeProperties } from "../shapes/shape-properties";
import Camera from "../camera/camera";
import { setColor, GetColor } from "../color/get-set";
import csMappings from "../shapes/cs-mappings";
import { caMappings } from "../animations/animanaged";
import Caption from "../captions/caption";
import SceneJson from "./scene-json";

type shape = Shape<any, any>;

interface Drawable {
    startTime: number;
    endTime: number;
    layer: number;
    shape: shape;
}

interface AddOptions {
    startTime?: number;
    duration?: number;
    layer?: number;
}

interface RenderOptions {
    width: number;
    height: number;
}

type aam = caMappings<any & ShapeProperties>;

declare class Scene {
    static fromJson(json: string, parse?: true, throwErrors?: false, csMappings?: csMappings, caMappings?: aam): Scene | false;
    static fromJson(json: string, parse: true, throwErrors: true, csMappings?: csMappings, caMappings?: aam): Scene;
    static fromJson(json: any, parse: false, throwErrors?: false, csMappings?: csMappings, caMappings?: aam): Scene | false;
    static fromJson(json: any, parse: false, throwErrors: true, csMappings?: csMappings, caMappings?: aam): Scene;

    constructor();

    drawables: Array<Drawable>;
    camera: Camera;
    duration: number;
    backgroundColor: setColor | GetColor;
    readonly autoDuration: number;

    add(drawable: shape): this;
    add(startTime: number, drawable: shape): this;
    add(startTime: number, duration: number, drawable: shape): this;
    add(startTime: number, duration: number, layer: number, drawable: shape): this;
    add(addOptions: AddOptions, drawable: shape): this;

    add(caption: Caption): this;
    add(id: string, caption: Caption): this;

    setBackgroundColor(color: setColor): this;

    setCamera(camera: Camera): this;

    render(at: number, options: RenderOptions, ctx?: CanvasRenderingContext2D): CanvasRenderingContext2D;

    setDuration(duration: number): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): SceneJson;
}

export default Scene;