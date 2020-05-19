import fs = require('fs');
import events = require('events');
import canvas = require('canvas');
import tinyColor = require('tinycolor2');

declare namespace canvideo {
    //Valid CSS Color
    type cssColor = string;
    //Number between 0 and 255
    type colorIntensity = number;
    //Number between 0 and 1
    type colorOpacity = number;
    type rgbColor = [colorIntensity, colorIntensity, colorIntensity];
    type rgbaColor = [colorIntensity, colorIntensity, colorIntensity, colorOpacity];
    type color = canvideo.Color | cssColor | rgbColor | rgbaColor;
    type videoSize = VideoSize | VideoSizeShort;
    type evenNumber = number;
    type nonNegativeInteger = number;
    type nonNegativeNumber = number;

    interface VideoSize {
        width: evenNumber;
        height: evenNumber;
    }
    interface VideoSizeShort {
        w: evenNumber;
        h: evenNumber;
    }
    interface VideoOptions {
        size: videoSize;
        fps: number;
    }
    interface VideoOptionsAll extends VideoSize {
        fps: number;
    }
    interface ShapeAttributes{
        color: Color,
        layer: nonNegativeInteger
    }
    interface RectangleAttributes extends ShapeAttributes{
        x: number,
        y: number,
        width: number,
        height: number
    }

    export function setTempPath(path: fs.PathLike): void;

    export class Color {
        constructor(color: cssColor);
        constructor(color: rgbColor);
        constructor(color: rgbaColor);
        constructor(red: colorIntensity, green: colorIntensity, blue: colorIntensity);
        constructor(red: colorIntensity, green: colorIntensity, blue: colorIntensity, alpha: colorOpacity);

        tinyColor: tinyColor.Instance;
        r: colorIntensity;
        red: colorIntensity;
        g: colorIntensity;
        green: colorIntensity;
        b: colorIntensity;
        blue: colorIntensity;
        a: colorOpacity;
        alpha: colorOpacity;

        toString(): string;
    }

    export class Animation {
        constructor(startValue: number, endValue: number);

        reverse(): this;
        calculate(percentage: number): void;
        last(): this;
    }

    export class Animanager<Attributes>{
        constructor(defaultValue: object, setVideo: (video: Video) => void);

        video: Video;
        defaultValue: Attributes;

        animate(startTime: number, endTime: number, value: (percentage: number) => Attributes | Animation): this;
        setAt(startTime: number, value: Attributes): this;
        valueAt(frameNumber: number): Attributes;
    }

    export abstract class Shape<Attributes extends ShapeAttributes> extends Animanager<Attributes> {
        constructor(color: color, defaultValue: Attributes, layer?: nonNegativeInteger);

        fillColor: Color;
        strokeColor: Color;
        strokeWidth: nonNegativeNumber;
        deleteTime: number;
        deleteFrame: number;

        setDeleteTime(time: number): this;

        fill(color: color): this;
        stroke(color: color, width: nonNegativeNumber): this;
        draw(ctx: canvas.CanvasRenderingContext2D): this;
    }

    export class Rectangle extends Shape<RectangleAttributes> {
        constructor(x: number, y: number, width: number, height: number, layer?: nonNegativeInteger);
    }

    export class Keyframe {
        constructor(startTime: number);

        shapes: Array<Shape<any>>;
        video: Video;
        frameNumber: number;

        addShape(shape: Shape<any>): this;
        render(shapes: Array<Shape<any>>): void;
    }

    export interface VideoAfterExport {
        on(event: "done", handler: () => void): this;
        on(event: "error", handler: () => void): this;
    }
    export abstract class VideoAfterExport {
        keyframes: Array<Keyframe>;
        tempPath: fs.PathLike;
        width: evenNumber;
        height: evenNumber;
        fps: number;

        get spf(): number;

        frameAtTime(time: number): number;
    }

    export interface Video {
        on(event: "done", handler: () => void): this;
        on(event: "error", handler: () => void): this;
    }
    export class Video extends events.EventEmitter {
        constructor(width: evenNumber, height: evenNumber, fps: number);
        constructor(size: videoSize, fps: number);
        constructor(options: VideoOptions);
        constructor(options: VideoOptionsAll);

        keyframes: Array<Keyframe>;
        tempPath: fs.PathLike;
        width: evenNumber;
        height: evenNumber;
        fps: number;

        get spf(): number;

        addKeyFrame(keyframe: Keyframe): this;
        frameAtTime(time: number): number;
        export(filePath: fs.PathLike): VideoAfterExport;
    }
}

export = canvideo;