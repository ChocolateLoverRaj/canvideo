import fs = require('fs');
import events = require('events');
import canvas = require('canvas');

declare namespace canvideo {
    type colorRepresentor = string | [number, number, number];
    type color = canvideo.Color | colorRepresentor;

    export function setTempPath(path: fs.PathLike): void;

    export class Color {
        constructor(color: colorRepresentor): this;

        value: number;

        static isValid(color: any): boolean;
    }

    export class Shape  {
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
        constructor(): this;

        shapes: Array<Shape>;

        joinToAnimation(animation: Animation): this;
        addShape(shape: Shape): this;
        render(frameNumber: number): number;
    }

    export interface Animation {
        on(event: "done", handler: () => void): this;
        on(event: "error", handler: () => void): this;
    }
    export class Animation extends events.EventEmitter {
        constructor(): Animation;

        keyframes: Array<Keyframe>;
        tempPath: fs.PathLike;

        addKeyFrame(keyframe: Keyframe): this;
        export(filePath: fs.PathLike): this;
    }
} 

export = canvideo;