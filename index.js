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
const tinyColor = require('tinycolor2');

//My Modules
const AsyncLoop = require("./lib/asyncLoop");
const myMath = require("./lib/myMath");
const helper = require("./lib/helper");

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
    //Constructor: color: string
    //Constructor: [r: number, g: number, b: number]
    //Constructor: [r: number, g: number, b: number, a: number]
    //Constructor: r: number, g: number, b: number
    //Constructor: r: number, g: number, b: number, a: number
    constructor(arg1, arg2, arg3, arg4) {
        function validValue(color) {
            var color = tinyColor(color);
            return color.isValid();
        }
        function validIntensity(n) {
            return typeof n === 'number' && n >= 0 && n <= 255;
        }
        function validOpacity(n) {
            return typeof n === 'number' && n >= 0 && n <= 1;
        }

        if (typeof arg1 === 'string' && typeof arg2 === 'undefined' && typeof arg3 === 'undefined' && typeof arg4 === 'undefined') {
            if (!validValue(arg1)) {
                throw new TypeError("Color is not a valid CSS color.");
            }
            else {
                this.tinyColor = tinyColor(arg1);
            }
        }
        else {
            var values = [];
            if (arg1 instanceof Array && typeof arg2 === 'undefined' && typeof arg3 === 'undefined' && typeof arg4 === 'undefined') {
                if (arg1.length === 3 || arg1.length == 4) {
                    values = arg1;
                }
                else {
                    throw new TypeError("Array must be rgb or rgba.");
                }
            }
            else if (typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'number' && typeof arg4 === 'undefined') {
                values = [arg1, arg2, arg3];
            }
            else if (typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'number' && typeof arg4 === 'number') {
                values = [arg1, arg2, arg3, arg4];
            }
            else {
                throw new TypeError("Invalid constructor.");
            }
            if (values.length === 3) {
                if (validIntensity(values[0]) && validIntensity(values[1]) && validIntensity(values[2])) {
                    this.tinyColor = tinyColor({ r: values[0], g: values[1], b: values[2] });
                }
                else {
                    throw new TypeError("Invalid rgb type.");
                }
            }
            else if (values.length === 4) {
                if (validIntensity(values[0]) && validIntensity(values[1]) && validIntensity(values[2]) && validOpacity(values[3])) {
                    this.tinyColor = tinyColor({ r: values[0], g: values[1], b: values[2], a: values[3] });
                }
                else {
                    throw new TypeError("Invalid rgba type.");
                }
            }
            else {
                throw new TypeError("Invalid constructor.");
            }
        }
    }
    set r(value) {
        if (value >= 0 && value <= 255) {
            var rgba = this.tinyColor.toRgb();
            rgba.r = value;
            this.tinyColor = tinyColor(rgba);
        }
        else {
            throw new TypeError("r must be between 0 and 255.");
        }
    }

    toString() {
        return this.tinyColor.toString();
    }
}

//Linear animation
canvideo.Animation = class {
    constructor(startValue, endValue) {
        if (typeof startValue === 'object' && typeof endValue === 'object') {
            this.startValue = startValue;
            this.endValue = endValue;
            this.reversed = false;
            this.doLast = false;
        }
        else {
            throw new TypeError("start and end values must be numbers.");
        }
    }

    reverse() {
        this.reversed = true;
        return this;
    }
    calculate(percentage) {
        if (this.reversed) {
            percentage = 1 - Math.abs(percentage * 2 - 1);
        }
        function calculateObject(startObject, endObject) {
            var value = {};
            for (var key in startObject) {
                var startValue = startObject[key], endValue = endObject[key];
                if (typeof startValue === 'number') {
                    var difference = endValue - startValue;
                    value[key] = startValue + percentage * difference;
                }
                else if (typeof startValue === 'object') {
                    value[key] = calculateObject(startValue, endValue);
                }
            }
            return value;
        }
        var a = calculateObject(this.startValue, this.endValue);
        return a;
    }
    last() {
        this.doLast = true;
        return this;
    }
}

//Animanager
canvideo.Animanager = class {
    constructor(defaultValue, setVideo) {
        if (typeof defaultValue === 'object' && typeof setVideo === 'function') {
            this.defaultValue = defaultValue;
            this.changes = new Map();
            this.changesToAdd = [];
            this.animations = new Map();
            this.currentAnimations = [];
            this.setVideo = setVideo;
        }
        else {
            throw new TypeError("Bad constructor");
        }
    }

    set video(value) {
        if (value instanceof canvideo.Video) {
            this._video = value;
            for (var i = 0; i < this.currentAnimations.length; i++) {
                var { startTime, endTime, value, isAnimationClass } = this.currentAnimations[i];
                var startFrame = this.video.frameAtTime(startTime), endFrame = this.video.frameAtTime(endTime);
                var animation = {
                    startTime: startTime,
                    startFrame: startFrame,
                    endTime: endTime,
                    endFrame: endFrame,
                    value: value,
                    isAnimationClass: isAnimationClass
                };
                if (this.animations.has(startFrame)) {
                    this.animations.set(startFrame, this.animations.get(startFrame).push(animation));
                }
                else {
                    this.animations.set(startFrame, [animation]);
                }
            }
            this.currentAnimations = [];
            for (var i = 0; i < this.changesToAdd.length; i++) {
                var { startTime, value } = this.changesToAdd[i];
                var startFrame = this.video.frameAtTime(startTime);
                var change = {
                    startTime: startTime,
                    startFrame: startFrame,
                    value: value
                };
                if (this.changes.has(startFrame)) {
                    change.value = helper.recursiveAssign(this.changes.get(startFrame), change.value);
                    this.changes.set(startFrame, change);
                }
                else {
                    this.changes.set(startFrame, change);
                }
            }
            this.changesToAdd = [];
            this.setVideo(value);
        }
        else {
            throw new TypeError("Video is not of type Video.");
        }
    }
    get video() {
        return this._video;
    }

    animate(startTime, endTime, value) {
        if (typeof startTime === 'number' && typeof endTime === 'number') {
            var animation = {
                startTime: startTime,
                endTime: endTime,
                value: value
            }
            if (typeof value === 'function' && value.length === 1) {
                animation.isAnimationClass = false;
            }
            else if (value instanceof canvideo.Animation) {
                animation.isAnimationClass = true;
                if (animation.doLast) {
                    this.setAt(endTime, animation.endValue);
                }
            }
            else {
                throw new TypeError("value must be a function or Animation class instance.");
            }
            this.currentAnimations.push(animation);
        }
        else {
            throw new TypeError("Start and end times must be numbers. value function must take one number parameter.");
        }

        return this;
    }
    setAt(startTime, value) {
        if (typeof startTime === 'number' && typeof value === 'object') {
            this.changesToAdd.push({
                startTime: startTime,
                value: value
            });
        }
        else {
            throw new TypeError("Invalid arguements.");
        }
        return this;
    }
    valueAt(frameNumber) {
        if (this.changes.has(frameNumber)) {
            this.defaultValue = helper.recursiveAssign(this.defaultValue, this.changes.get(frameNumber).value);
        }
        if (this.animations.has(frameNumber)) {
            this.currentAnimations = this.currentAnimations.concat(this.animations.get(frameNumber));
        }

        var nextFrameAnimations = [];
        var calculatedValue = this.defaultValue;
        
        for (var i = 0; i < this.currentAnimations.length; i++) {
            var { startFrame, endFrame, value, isAnimationClass } = this.currentAnimations[i];
            var percentage = (frameNumber - startFrame) / (endFrame - startFrame);
            if (frameNumber <= endFrame) {
                nextFrameAnimations.push(this.currentAnimations[i]);
            }
            if (isAnimationClass) {
                calculatedValue = helper.recursiveAssign(calculatedValue, value.calculate(percentage));
            }
            else {
                calculatedValue = helper.recursiveAssign(calculatedValue, value(percentage));
            }
        }
        this.currentAnimations = nextFrameAnimations;
        return calculatedValue;
    }
}

//Shape
canvideo.Shape = class extends canvideo.Animanager {
    constructor(color, defaultValue, layer = 0) {
        if (!(typeof layer === 'number' && Number.isSafeInteger(layer) && layer >= 0)) {
            throw new TypeError("layer must be a non negative integer.");
        }
        super(helper.recursiveAssign({ layer: layer }, defaultValue), function (value) {
            this.deleteFrame = this.video.frameAtTime(this.deleteTime);
        });
        this.color = color;
        this.deleteFrame = Infinity;
        this.deleteTime = Infinity;
    };

    set color(value) {
        if (typeof value === 'object') {
            this._color = helper.recursiveAssign(this.color, value);
        }
        else {
            this._color = new canvideo.Color(value);
        }
        this.defaultValue.color = this._color;
    }
    get color() {
        return this._color;
    }

    setDeleteTime(time) {
        if (typeof time === 'number') {
            this.deleteTime = time;
        }
        else {
            throw new TypeError("time must be a number (number of seconds).");
        }

        return this;
    }
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
    constructor(x = 0, y = 0, width = 100, height = 100, color, layer) {
        if (!typeof x == 'number') {
            throw new TypeError(`x: ${x} is not a number.`);
        }
        if (!typeof y == 'number') {
            throw new TypeError(`y: ${y} is not a number.`);
        }
        if (!typeof width == 'number') {
            throw new TypeError(`width: ${width} is not a number.`);
        }
        if (!typeof height == 'number') {
            throw new TypeError(`height: ${height} is not a number.`);
        }
        super(color, {
            x: x,
            y: y,
            width: width,
            height: height
        }, layer);
    }

    draw(ctx, frameNumber) {
        var value = this.valueAt(frameNumber);
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(value.x, value.y, value.width, value.height);

        return this;
    }
}

//Keyframe Class
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
    set video(value) {
        if (value instanceof canvideo.Video) {
            this._video = value;
            for (var i = 0; i < this.shapes.length; i++) {
                this.shapes[i].video = this.video;
            }
        }
        else {
            throw new TypeError("Video is not of type Video.");
        }
    }
    get video() {
        return this._video;
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
            shape.shapeIndex = this.shapes.length;
            this.shapes.push(shape);
        }
        else {
            throw new TypeError("shape is not of type Shape.");
        }
        return this;
    }
    render(shapes = []) {
        if (typeof this.frameNumber == 'number') {
            function sorter(a, b) {
                if (a.valueAt(this.frameNumber).layer === b.valueAt(this.frameNumber).layer) {
                    return a.shapeIndex - b.shapeIndex;
                }
                else {
                    return a.valueAt(this.frameNumber).layer - b.valueAt(this.frameNumber).layer;
                }
            };

            var shapesToRender = [];

            if (shapes instanceof Array) {
                for (var i = 0; i < shapes.length; i++) {
                    if (shapes[i] instanceof canvideo.Shape) {
                        if (shapes[i].deleteFrame > this.frameNumber) {
                            shapesToRender.push(shapes[i]);
                        }
                    }
                    else {
                        console.log(shapes, this.frameNumber)
                        throw new TypeError(`shapes[${i}] is not a Shape.`);
                    }
                }
            }
            else {
                throw new TypeError("Shapes must be an array of shapes.");
            }

            shapesToRender = shapesToRender.concat(this.shapes).sort(sorter.bind(this));
            this.video.loop.goal++;

            //Render frame 0
            var canvas = createCanvas(this.video.width, this.video.height);
            var ctx = canvas.getContext('2d');
            for (var i = 0; i < shapesToRender.length; i++) {
                shapesToRender[i].draw(ctx, this.frameNumber);
            }
            var framePath = this.video.tempPath + "/frame" + this.frameNumber + ".jpg";
            canvas.createJPEGStream()
                .on("end", () => {
                    this.video.loop.emit("result", false);
                })
                .on("error", err => {
                    this.video.loop.emit("result", err, this.frameNumber);
                })
                .pipe(fs.createWriteStream(framePath));

            //Render next keyframe
            if (this.frameNumber + 1 < this.video.keyframes.length) {
                this.video.keyframes[this.frameNumber + 1].render(shapesToRender);
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

//Video class
canvideo.Video = class extends EventEmitter {
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
            keyframe.video = this;
            keyframe.frameNumber = frameNumber;
            this.keyframes[frameNumber] = keyframe;
        }
        else {
            throw new TypeError("keyframe is not of type Keyframe.");
        }

        return this;
    }
    frameAtTime(time) {
        if (typeof time === 'number') {
            return Math.round(time * this.fps);
        }
        else {
            throw new TypeError("time must be a number.");
        }
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