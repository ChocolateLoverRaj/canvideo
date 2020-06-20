import MyCtx from "./my-ctx";

declare interface Drawable {
    at: (frameNumber: number) => {
        draw: (ctx: MyCtx) => any;
    }
}

export = Drawable;