import { CanvasRenderingContext2D } from 'canvas';

abstract class MyCtx extends CanvasRenderingContext2D {
    now: number;
}

export = MyCtx;