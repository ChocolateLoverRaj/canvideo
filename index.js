//Main file

//Dependancies

//Node.js Modules
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

//Npm Modules
const { createCanvas } = require('canvas');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

//My Modules
const AsyncLoop = require("./lib/asyncLoop");
const myMath = require("./lib/myMath");

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
            this.value = color;
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
canvideo.Shape = class {
    constructor(color) {
        if (color instanceof canvideo.Color) {
            this.color = color;
        }
        else {
            this.color = new canvideo.Color(color);
        }
    };
}

//Control Point
canvideo.ControlPoint = class {
    static defaultSetterX(value) {
        this._x = value;
    }
    static defaultSetterY(value) {
        this._y = value;
    }
    constructor(shape, setterX = defaultSetterX, setterY = defaultSetterY) {
        if (shape instanceof canvideo.Shape) {
            this.shape = shape;
            this.setterX = setterX;
            this.setterY = setterY;
            this._x = 0;
            this._y = 0;
        }
        else {
            throw new TypeError(`Shape: ${shape} is not of type Shape`);
        }
    }
    set x(value) {
        return this.setterX(value);
    }
    get x() {
        return this._x;
    }
    set y(value) {
        return this.setterY(value);
    }
    get y() {
        return this._y;
    }
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

    draw(ctx) {
        ctx.fillStyle = this.color.value;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//Frame Class
canvideo.Keyframe = class {
    constructor(startTime) {
        if (typeof startTime == 'number') {
            this.startTime = startTime;
        }
        else {
            throw new TypeError("startTime must be a number.");
        }
        this.shapes = [];
    }
    set animation(value) {
        if (value instanceof canvideo.Animation) {
            this._animation = value;
        }
        else {
            throw new TypeError("Animation is not of type Animation.");
        }
    }
    get animation() {
        return this._animation;
    }
    set frameNumber(value) {
        if (typeof value == 'number') {
            this._frameNumber = value;
        }
        else {
            throw new TypeError("frameNumber must be a number.");
        }
    }
    get frameNumber() {
        return this._frameNumber;
    }

    addShape(shape) {
        if (shape instanceof canvideo.Shape) {
            this.shapes.push(shape);
        }
        else {
            throw new TypeError("shape is not of type Shape.");
        }
        return this;
    }
    render(shapes = []) {
        if (typeof this.frameNumber == 'number') {
            if (shapes instanceof Array) {
                for (var i = 0; i < shapes.length; i++) {
                    if (!(shapes[i] instanceof canvideo.Shape)) {
                        throw new TypeError(`shapes[${i}] is not a Shape.`);
                    }
                }
            }
            else {
                throw new TypeError("Shapes must be an array of shapes.");
            }

            var shapesToRender = shapes.concat(this.shapes);
            this.animation.loop.goal += 1;

            //Render frame 0
            var canvas = createCanvas(this.animation.width, this.animation.height);
            var ctx = canvas.getContext('2d');
            for (var i = 0; i < shapesToRender.length; i++) {
                shapesToRender[i].draw(ctx);
            }
            var framePath = this.animation.tempPath + "/frame" + this.frameNumber + ".jpg";
            canvas.createJPEGStream()
                .on("end", () => {
                    this.animation.loop.emit("result", false);
                })
                .on("error", err => {
                    this.animation.loop.emit("result", err, this.frameNumber);
                })
                .pipe(fs.createWriteStream(framePath));

            //Render next keyframe
            if (this.frameNumber + 1 < this.animation.keyframes.length) {
                this.animation.keyframes[this.frameNumber + 1].render(shapesToRender);
            }
            else {
                //This is the last frame
            }

            return this;
        }
        else {
            throw new TypeError("this.frameNumber is not a number");
        }
    }
}

//Animation class
canvideo.Animation = class extends EventEmitter {
    constructor(arg1 = { width: 200, height: 200 }, arg2, arg3) {
        //Constructor: width: number, height: number, fps
        //Constructor: { width: number, height: number }, fps
        //Constructor: { w: number, h: number }, fps
        //Constructor: { width: number, height: number, fps: number}
        //Constructor: { w: number, h: number, fps: number}
        //Constructor: { size: { width: number, height: number }, fps: number }
        //Constructor: { size: { w: number, h: number }, fps: number }
        var width, height, fps;
        function typeCheck(arg1, arg2, arg3) {
            if (typeof arg1 == 'number' && typeof arg2 == 'number' && typeof arg3 == 'number') {
                width = arg1, height = arg2, fps = arg3;
            }
            else if (typeof arg1 == 'object' && typeof arg2 == 'number' && typeof arg3 == 'undefined') {
                fps = arg2;
                if (typeof arg1.width == 'number' && typeof arg1.height == 'number') {
                    width = arg1.width, height = arg1.height;
                }
                else if (typeof arg1.w == 'number' && typeof arg1.h == 'number') {
                    width = arg1.w, height = arg1.h;
                }
                else {
                    return false;
                }
            }
            else if (typeof arg1 == 'object' && typeof arg1.fps == 'number' && typeof arg2 == 'undefined' && typeof arg3 == 'undefined') {
                fps = arg1.fps;
                if (typeof arg1.size == 'object') {
                    if (typeof arg1.size.width == 'number' && typeof arg1.size.height == 'number') {
                        width = arg1.size.width, height = arg1.size.height;
                    }
                    else if (typeof arg1.size.w == 'number' && typeof arg1.size.h == 'number') {
                        width = arg1.size.w, height = arg1.size.h;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (typeof arg1.width == 'number' && typeof arg1.height == 'number') {
                        width = arg1.width, height = arg1.height;
                    }
                    else if (typeof arg1.w == 'number' && typeof arg1.h == 'number') {
                        width = arg1.w, height = arg1.h;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                console.log("none")
                return false;
            }
        }
        if (typeCheck(arg1, arg2, arg3) === false) {
            throw new TypeError("Invalid constructor.");
        }
        if (myMath.isOdd(width)) {
            throw new TypeError("width must be an even number.");
        }
        if (myMath.isOdd(height)) {
            throw new TypeError("height must be an even number.");
        }

        super();

        this.keyframes = [];
        this.tempPath = config.tempPath;
        this.loop = new AsyncLoop();
        this.width = width;
        this.height = height;
        this.fps = fps;
        this.exported = false;

        this.command = ffmpeg();
        this.command.on('end', () => {
            this.emit("done");
        });
        this.command.on('error', () => {
            this.emit("error");
        });
    }

    set tempPath(value) {
        if (this.exported) {
            throw new SyntaxError("Cannot change tempPath after exporting.");
        }
        if (typeof value == 'string' || value instanceof Buffer || value instanceof URL) {
            //Make sure it exists
            if (fs.existsSync(value)) {
                this._tempPath = value;
            }
            else {
                throw new URIError(`Path: ${value} does not exist.`);
            }
        }
        else {
            throw new TypeError(`Path: ${value} is not a valid path type.`);
        }
    }
    get tempPath() {
        return this._tempPath;
    }
    get spf() {
        return 1 / this.fps;
    }

    addKeyframe(keyframe) {
        if (this.exported) {
            throw new SyntaxError("Cannot add keyframe after exporting.");
        }
        if (keyframe instanceof canvideo.Keyframe) {
            var frameNumber = Math.round(keyframe.startTime * this.fps);
            keyframe.animation = this;
            keyframe.frameNumber = frameNumber;
            this.keyframes[frameNumber] = keyframe;
        }
        else {
            throw new TypeError("keyframe is not of type Keyframe.");
        }

        return this;
    }
    export(filePath) {
        if (this.exported) {
            throw new SyntaxError("Cannot export twice.");
        }
        if (typeof filePath == 'string' || filePath instanceof Buffer || filePath instanceof URL) {
            if (path.extname(filePath) !== ".mp4") {
                throw new URIError(`File path: ${filePath} must have the extension .mp4.`);
            }
        }
        else {
            throw new TypeError(`File path: ${filePath} is not a valid path type.`);
        }
        
        //Make sure there is a keyframe at 0 seconds
        if (!(this.keyframes[0] instanceof canvideo.Keyframe)) {
            this.addKeyframe(new canvideo.Keyframe(0));
        }

        //Fill in the blank frames
        for (var i = 0; i < this.keyframes.length; i++) {
            if (!(this.keyframes[i] instanceof canvideo.Keyframe)) {
                this.addKeyframe(new canvideo.Keyframe(i * this.spf));
            }
        }

        //Render the first frame
        this.keyframes[0].render();

        this.loop.on("done", errors => {
            if (!errors) {
                this.command
                    .input(config.tempPath + "/frame%1d.jpg")
                    .inputFPS(this.fps)
                    .save(filePath)
                    .outputFPS(this.fps);
            }
            else {
                this.emit("error");
            }
        });
        this.exported = true;

        return this;
    }
}

//Export the module
module.exports = canvideo;