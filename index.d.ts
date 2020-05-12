import fs = require('fs');
import events = require('events');
import canvas = require('canvas');

declare namespace canvideo {
    type colorRepresentor = string | [number, number, number];
    type color = canvideo.Color | colorRepresentor;
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
        constructor(color: colorRepresentor): this;

        value: number;

        static isValid(color: any): boolean;
    }

    export abstract class Shape  {
        constructor(color: color): this;

        color: Color;
    }

    export class Rectangle extends Shape {
        constructor(x: number, y: number, width: number, height: number, color?: color): this;

        x: number;
        y: number;
        width: number;
        height: number;

        draw(ctx: canvas.CanvasRenderingContext2D): void;
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
        export(filePath: fs.PathLike): AnimationAfterExport;
    }
} 

export = canvideo;