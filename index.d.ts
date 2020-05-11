import fs = require('fs');
import ffmpeg = require('fluent-ffmpeg');

declare namespace canvideo {
    interface CodecData {
        format: string,
        audio: string,
        video: string,
        duration: string,
        video_details: Array<string>
    }
    interface Progress {
        frames: number,
        currentFps: number,
        currentKbps: number,
        targetSize: 2,
        timemark: string,
        percent: number
    }

    type color = canvideo.Color | string | [number, number, number];

    export function setTempPath(path: fs.PathLike): void;

    export class Color {
        constructor(color: color): this;

        color: number;

        static isValid(color: any): boolean;
    }

    export class Shape extends Color {
        constructor(color: color): this;
    }

    export class Rectangle extends Shape {
        constructor(x: number, y: number, width: number, height: number, color?: color): Rectangle;

        x: number;
        y: number;
        width: number;
        height: number;
    }

    export interface Animation {
        on(event: 'start', handler: (commandLine?: string) => void): this;
        on(event: 'codecData', handler: (data?: CodecData) => void): this;
        on(event: 'progress', handler: (progress?: Progress) => void): this;
        on(event: 'stderr', handler: (stderr?: string) => void): this;
        on(event: 'error', handler: (err?: Error, stdout?: string, stderr?: string) => void): this;
        on(event: 'end', handler: (stdout?: string, stderr?: string) => void): this;
    }
    export class Animation extends ffmpeg {
        constructor(): Animation;

        add(shape: Shape): this;
        export(filePath: fs.PathLike, tempPath?: fs.PathLike): this;
    }
} 

export = canvideo;