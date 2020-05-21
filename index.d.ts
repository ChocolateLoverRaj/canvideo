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
    type coordinate = [ number, number ];

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
    interface ShapeAttributes {
        fillColor: Color;
        strokeColor: Color;
        strokeWidth: nonNegativeNumber;
        layer: nonNegativeInteger;
    }
    interface RectangleAttributes extends ShapeAttributes {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    interface SquareAttributes extends ShapeAttributes {
        x: number;
        y: number;
        size: number;
    }
    interface Coordinate{
        x: number,
        y: number
    }
    interface PolygonAttributes extends ShapeAttributes {
        points: Array<Point>
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
        inLayer(layer: nonNegativeInteger): this;
        draw(ctx: canvas.CanvasRenderingContext2D): this;
    }

    export class Rectangle extends Shape<RectangleAttributes> {
        constructor(x: number, y: number, width: number, height: number, layer?: nonNegativeInteger);

        x: number;
        y: number;
        width: number;
        height: number;
    }

    export class Square extends Shape<SquareAttributes>{
        constructor(x: number, y: number, width: number, layer?: nonNegativeNumber);

        x: number;
        y: number;
        size: number;
    }

    export class Point {
        constructor(x: number, y: number);
        constructor(coordinate: coordinate);
        constructor(coordinate: Coordinate);

        x: number;
        y: number;
    }

    export class Polygon extends Shape<PolygonAttributes>{
        constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, ...coordinates: Array<number>);
        constructor(point1: coordinate, point2: coordinate, point3: coordinate, ...points: Array<coordinate>);
        constructor(point1: Coordinate, point2: Coordinate, point3: Coordinate, ...points: Array<Coordinate>);

        points: Array<Point>;
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