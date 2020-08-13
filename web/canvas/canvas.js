export const createCanvas = (width, height) => {
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    return canvas;
}

export const Ctx = CanvasRenderingContext2D;