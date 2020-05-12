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
const AsyncLoop = require("./asyncLoop");

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
    get x(){
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
    constructor() {
        this.shapes = [];
    }
    joinToAnimation(animation) {
        if (animation instanceof canvideo.Animation) {
            this.animation = animation;
        }
        else {
            throw new TypeError("Animation is not of type Animation.");
        }

        return this;
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
    render(frameNumber) {
        if (typeof frameNumber == 'number') {
            //Render frame 0
            var canvas = createCanvas(200, 200);
            var ctx = canvas.getContext('2d');
            for (var i = 0; i < this.shapes.length; i++) {
                this.shapes[i].draw(ctx);
            }
            var framePath = this.animation.tempPath + "/frame" + frameNumber + ".jpg";
            canvas.createJPEGStream()
                .on("end", () => {
                    this.animation.loop.emit("result", false);
                })
                .on("error", err => {
                    this.animation.loop.emit("result", err, frameNumber);
                })
                .pipe(fs.createWriteStream(framePath));

            return 1;
        }
        else {
            throw new TypeError("frameNumber is not a number");
        }
    }
}

//Animation class
canvideo.Animation = class extends EventEmitter {
    constructor() {
        super();

        this.keyframes = [];
        this.tempPath = config.tempPath;
        this.loop = new AsyncLoop();

        this.command = ffmpeg();
        this.command.on('end', () => {
            this.emit("done");
        });
        this.command.on('error', () => {
            this.emit("error");
        });
    }

    set tempPath(value) {
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

    addKeyframe(keyframe) {
        if (keyframe instanceof canvideo.Keyframe) {
            keyframe.joinToAnimation(this);
            this.keyframes.push(keyframe);
        }
        else {
            throw new TypeError("keyframe is not of type Keyframe.");
        }

        return this;
    }
    export(filePath) {
        if (typeof filePath == 'string' || filePath instanceof Buffer || filePath instanceof URL) {
            if (path.extname(filePath) !== ".mp4") {
                throw new URIError(`File path: ${filePath} must have the extension .mp4.`);
            }
        }
        else {
            throw new TypeError(`File path: ${filePath} is not a valid path type.`);
        }

        for (var i = 0; i < this.keyframes.length; i++) {
            this.loop.goal += this.keyframes[i].render(this.loop.goal);
        }
        this.loop.on("done", errors => {
            if (!errors) {
                this.command
                    .input(config.tempPath + "/frame%1d.jpg")
                    .inputFPS(1)
                    .save(filePath)
                    .outputFPS(1);
            }
            else {
                this.emit("error");
            }
        });

        return this;
    }
}

//Export the module
module.exports = canvideo;