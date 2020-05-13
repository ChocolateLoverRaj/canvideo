import fs = require('fs');
import events = require('events');
import canvas = require('canvas');

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
    interface VideoOptionsAll implements videoSize {
        fps: number;
    }

    export function setTempPath(path: fs.PathLike): void;

    export class Color {
        constructor(color: cssColor): this;
        constructor(color: rgbColor): this;
        constructor(color: rgbaColor): this;
        constructor(red: colorIntensity, green: colorIntensity, blue: colorIntensity): this;
        constructor(red: colorIntensity, green: colorIntensity, blue: colorIntensity, alpha: colorOpacity): this;

        value: number;
    }

    export abstract class Shape {
        constructor(color: color): this;

        color: Color;
        deleteTime: number;
        deleteFrame: number;

        setDeleteTime(time: number): this;
    }

    export class Rectangle extends Shape {
        constructor(x: number, y: number, width: number, height: number, color?: color): this;

        x: number;
        y: number;
        width: number;
        height: number;
        video: Video;

        draw(ctx: canvas.CanvasRenderingContext2D): this;
    }

    export class Keyframe {
        constructor(startTime: number): this;

        shapes: Array<Shape>;
        video: Video;
        frameNumber: number;

        addShape(shape: Shape): this;
        render(shapes: Array<Shape>): void;
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
        constructor(width: evenNumber, height: evenNumber, fps: number): this;
        constructor(size: videoSize, fps: number): this;
        constructor(options: VideoOptions): this;
        constructor(options: VideoOptionsAll): this;

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