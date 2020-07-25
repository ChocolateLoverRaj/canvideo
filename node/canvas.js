//FIXME Canvideo depends on 2 things from the npm canvas package.
//The html scripts are different because they can't reference canvas package.
//We need to create a way of files to be overridden by another.

//createCanvas
//Node: just import and export canvas.createCanvas.
//Web: create a canvas element and change its width and height.

//Ctx
//Node: just import and export canvas.CanvasRenderingContext2D.
//Web: Export global variable called CanvasRenderingContext2D.

var node = true;
if (typeof CanvasRenderingContext2D === 'function') {
    node = false;
}

var createCanvas;
var Ctx;

if (node) {
    import canvas from 'canvas';
    createCanvas = (width, height) => {
        return canvas.createCanvas(width, height);
    };
    Ctx = canvas.CanvasRenderingContext2D;
}
else {
    createCanvas = (width, height) => {
        let canvas = document.createElement('canvas');
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        return canvas;
    };
    Ctx = CanvasRenderingContext2D;
}

export { createCanvas, Ctx };