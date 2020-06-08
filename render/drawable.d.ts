import { CanvasRenderingContext2D } from 'canvas';

declare interface Drawable {
    at: (frameNumber: number) => {
        draw: (ctx: CanvasRenderingContext2D) => any;
    }
}

export = Drawable;