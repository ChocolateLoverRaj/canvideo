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
    type animationSize = AnimationSize | AnimationSizeShort;
    type evenNumber = number;

    interface AnimationSize {
        width: evenNumber;
        height: evenNumber;
    }
    interface AnimationSizeShort {
        w: evenNumber;
        h: evenNumber;
    }
    interface AnimationOptions {
        size: animationSize;
        fps: number;
    }
    interface AnimationOptionsAll implements animationSize {
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
        animation: Animation;

        draw(ctx: canvas.CanvasRenderingContext2D): this;
    }

    export class Keyframe {
        constructor(startTime: number): this;

        shapes: Array<Shape>;
        animation: Animation;
        frameNumber: number;

        addShape(shape: Shape): this;
        render(shapes: Array<Shape>): void;
    }

    export interface AnimationAfterExport {
        on(event: "done", handler: () => void): this;
        on(event: "error", handler: () => void): this;
    }
    export abstract class AnimationAfterExport {
        keyframes: Array<Keyframe>;
        tempPath: fs.PathLike;
        width: evenNumber;
        height: evenNumber;
        fps: number;

        get spf(): number;

        frameAtTime(time: number): number;
    }

    export interface Animation {
        on(event: "done", handler: () => void): this;
        on(event: "error", handler: () => void): this;
    }
    export class Animation extends events.EventEmitter {
        constructor(width: evenNumber, height: evenNumber, fps: number): this;
        constructor(size: animationSize, fps: number): this;
        constructor(options: AnimationOptions): this;
        constructor(options: AnimationOptionsAll): this;

        keyframes: Array<Keyframe>;
        tempPath: fs.PathLike;
        width: evenNumber;
        height: evenNumber;
        fps: number;

        get spf(): number;

        addKeyFrame(keyframe: Keyframe): this;
        frameAtTime(time: number): number;
        export(filePath: fs.PathLike): AnimationAfterExport;
    }
}

export = canvideo;