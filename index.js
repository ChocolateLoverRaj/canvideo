//Main file

//Dependancies

//Node.js Modules
const fs = require('fs');
const path = require('path');

//Npm Modules
const { createCanvas } = require('canvas');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

//Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

//Canvideo module
const canvideo = {};

//Config
const config = {};

//Set tempPath
canvideo.setTempPath = function (path) {
    if (typeof path == 'string' || path instanceof Buffer || path instanceof URL) {
        //Make sure it exists
        if (fs.existsSync(path)) {
            config.tempPath = path;
        }
        else {
            throw new URIError(`Path: ${path} does not exist.`);
        }
    }
    else {
        throw new TypeError(`Path: ${path} is not a valid path type.`);
    }
}

//Color
canvideo.Color = class {
    constructor(color = "white") {
        if (canvideo.Color.isValid(color)) {
            this.color = color;
        }
        else {
            throw new TypeError(`Color: ${color} is not a valid color.`);
        }
    }
    static testCtx = createCanvas(1, 1).getContext('2d');
    static isValid(color) {
        function isRGB(color) {
            if (typeof color == 'object' && color instanceof Array && color.length == 3) {
                for (var i = 0; i < 3; i++) {
                    if (!(typeof color[i] == 'number' && color[i] >= 0 && color[i] <= 255)) {
                        return false;
                    }
                }
                return true;
            }
            else {
                return false;
            }
        }

        //Type checking
        if (color instanceof canvideo.Color) {
            return true;
        }
        else if (typeof color == 'string' || isRGB(color)) {
            //Make sure color is not black
            if (color == "black" || color == "#000000" || color == [0, 0, 0]) {
                return true;
            }
            else {
                //Reset fillStyle
                this.testCtx.fillStyle = "black";
                //If fillStyle is valid then it should be something other than black
                this.testCtx.fillStyle = color;
                return this.testCtx.fillStyle !== "#000000";
            }
        }
        else {
            throw TypeError("Invalid color type.");
        }
    }
}

//Shape
canvideo.Shape = class extends canvideo.Color {
    constructor(color) {
        super(color);
    };
}

//Rectangle
canvideo.Rectangle = class extends canvideo.Shape {
    constructor(x = 0, y = 0, width = 100, height = 100, color) {
        super(color);
        if (typeof x == 'number') {
            this.x = x;
        }
        else {
            throw new TypeError(`x: ${x} is not a number.`);
        }
        if (typeof y == 'number') {
            this.y = y;
        }
        else {
            throw new TypeError(`y: ${y} is not a number.`);
        }
        if (typeof width == 'number') {
            this.width = width;
        }
        else {
            throw new TypeError(`width: ${width} is not a number.`);
        }
        if (typeof height == 'number') {
            this.height = height;
        }
        else {
            throw new TypeError(`height: ${height} is not a number.`);
        }
    }
}

//Animation class
canvideo.Animation = class extends ffmpeg {
    constructor() {
        super();
        this.shapes = [];
    }

    add(shape) {
        if (shape instanceof canvideo.Rectangle) {
            this.shapes.push(shape);
        }
        else {
            throw new TypeError("shape is not of type Rectangle");
        }
        return this;
    }

    export(filePath, tempPath = config.tempPath) {
        if (typeof filePath == 'string' || filePath instanceof Buffer || filePath instanceof URL) {
            if (path.extname(filePath) !== ".mp4") {
                throw new URIError(`File path: ${filePath} must have the extension .mp4.`);
            }
        }
        else {
            throw new TypeError(`File path: ${filePath} is not a valid path type.`);
        }
        if (typeof tempPath == 'string' || tempPath instanceof Buffer || tempPath instanceof URL) {
            //Make sure it exists
            if (!fs.existsSync(tempPath)) {
                throw new URIError(`Path: ${tempPath} does not exist.`);
            }
        }
        else {
            throw new TypeError(`Path: ${tempPath} is not a valid path type.`);
        }

        //Create the canvas
        var canvas = createCanvas(200, 200);
        var ctx = canvas.getContext('2d');

        for (var i = 0; i < this.shapes.length; i++) {
            let { x, y, width, height, color } = this.shapes[i];
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        }

        //Save the canvas
        canvas.createJPEGStream().pipe(fs.createWriteStream(config.tempPath + "/frame0.jpg"));

        this.input(config.tempPath + "/frame%1d.jpg")
            .inputFPS(1)
            .save(filePath)
            .outputFPS(1);

        return this;
    }
}

//Export the module
module.exports = canvideo;