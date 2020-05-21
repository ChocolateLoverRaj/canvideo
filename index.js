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
    constructor(arg1 = "white", arg2, arg3, arg4) {
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
        this.setIntensity('r', value);
    }
    get r() {
        return this.tinyColor.toRgb().r;
    }
    set red(value) {
        this.r = value;
    }
    get red() {
        return this.r;
    }

    set g(value) {
        this.setIntensity('g', value);
    }
    get g() {
        return this.tinyColor.toRgb().g;
    }
    set green(value) {
        this.g = value;
    }
    get green() {
        return this.g;
    }

    set b(value) {
        this.setIntensity('b', value);
    }
    get b() {
        return this.tinyColor.toRgb().b;
    }
    set blue(value) {
        this.b = value;
    }
    get blue() {
        return this.b;
    }

    set a(value) {
        this.setAlpha(value);
    }
    get a() {
        return this.tinyColor.toRgb().a;
    }
    set alpha(value) {
        this.a = value;
    }
    get alpha() {
        return this.a;
    }

    toString() {
        return this.tinyColor.toString();
    }

    setIntensity(color, intensity) {
        if (intensity >= 0 && intensity <= 255) {
            var rgba = this.tinyColor.toRgb();
            rgba[color] = intensity;
            this.tinyColor = tinyColor(rgba);
        }
        else {
            throw new TypeError(`${color} must be between 0 and 255.`);
        }
    }
    setAlpha(opacity) {
        if (opacity >= 0 && opacity <= 1) {
            this.tinyColor.setAlpha(opacity);
        }
        else {
            throw new TypeError("Alpha must be between 0 and 1.");
        }
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
        return calculateObject(this.startValue, this.endValue);
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
    constructor(defaultValue, layer = 0) {
        if (!(typeof layer === 'number' && Number.isSafeInteger(layer) && layer >= 0)) {
            throw new TypeError("layer must be a non negative integer.");
        }
        super(helper.recursiveAssign({ layer: layer }, defaultValue), function (value) {
            this.deleteFrame = this.video.frameAtTime(this.deleteTime);
        });
        this.fillColor = undefined;
        this.strokeColor = undefined;
        this.strokeWidth = undefined;
        this.deleteFrame = Infinity;
        this.deleteTime = Infinity;
        this._draw = new helper.ExtendibleFunction();
        this.draw = function (ctx, frameNumber) {
            var value = this.valueAt(frameNumber);
            ctx.fillStyle = this.fillColor.toString();
            ctx.strokeStyle = this.strokeColor.toString();
            ctx.strokeWidth = this.strokeWidth;
        }
    };

    set draw(value) {
        this._draw.action = value.bind(this);
    }
    get draw() {
        return this._draw.action;
    }
    set fillColor(value) {
        if (typeof value === 'object') {
            this._fillColor = helper.recursiveAssign(this.fillColor, value);
        }
        else {
            this._fillColor = new canvideo.Color(value);
        }
        this.defaultValue.fillColor = this.fillColor;
    }
    get fillColor() {
        return this._fillColor;
    }
    set strokeColor(value) {
        if (typeof value === 'object') {
            this._strokeColor = helper.recursiveAssign(this.strokeColor, value);
        }
        else {
            this._strokeColor = new canvideo.Color(value);
        }
        this.defaultValue.strokeColor = this.strokeColor;
    }
    get strokeColor() {
        return this._strokeColor;
    }
    set strokeWidth(value = 0) {
        if (typeof value === 'number' && value >= 0) {
            this._strokeWidth = value;
        }
        else {
            throw new TypeError("strokeWidth must be a non negative number.");
        }
    }
    get strokeWidth() {
        return this._strokeWidth;
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
    fill(color) {
        this.fillColor = color;
        return this;
    }
    stroke(color, width) {
        this.strokeColor = color;
        this.strokeWidth = width;
        return this;
    }
}

//Rectangle
canvideo.Rectangle = class extends canvideo.Shape {
    constructor(x = 0, y = 0, width = 100, height = 100, layer) {
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
        super({
            x: x,
            y: y,
            width: width,
            height: height
        }, layer);

        this.draw = function (ctx, frameNumber) {
            var value = this.valueAt(frameNumber);
            ctx.fillRect(value.x, value.y, value.width, value.height);
            if (this.strokeWidth > 0) {
                ctx.strokeRect(value.x, value.y, value.width, value.height);
            }

            return this;
        };
    }
}

//Square
canvideo.Square = class extends canvideo.Shape {
    constructor(x = 0, y = 0, size = 100, layer) {
        if (!typeof x == 'number') {
            throw new TypeError(`x: ${x} is not a number.`);
        }
        if (!typeof y == 'number') {
            throw new TypeError(`y: ${y} is not a number.`);
        }
        if (!typeof size == 'number') {
            throw new TypeError(`size: ${size} is not a number.`);
        }
        super({
            x: x,
            y: y,
            size: size
        }, layer);

        this.draw = function (ctx, frameNumber) {
            var value = this.valueAt(frameNumber);
            ctx.fillRect(value.x, value.y, value.size, value.size);
            if (this.strokeWidth > 0) {
                ctx.strokeRect(value.x, value.y, value.size, value.size);
            }

            return this;
        };
    }
}

//Point
canvideo.Point = class {
    constructor(arg1, arg2) {
        //Constructor: x: number, y: number
        //Constructor: [ x: number, y: number ]
        //Constructor: { x: number, y: number }
        if (typeof arg1 === 'number' && typeof arg2 === 'number') {
            this.x = arg1, this.y = arg2;
        }
        else if (arg1 instanceof Array && arg1.length === 2 && typeof arg1[0] === 'number' && typeof arg1[1] === 'number') {
            this.x = arg1[0], this.y = arg1[1];
        }
        else if (typeof arg1 === 'object' && typeof arg1.x === 'number' && typeof arg1.y === 'number') {
            this.x = arg1.x, this.y = arg1.y;
        }
        else {
            throw new TypeError("Invalid Constructor.");
        }
    }

    set x(value) {
        if (typeof value === 'number') {
            this._x = value;
        }
        else {
            throw new TypeError("x must be a number");
        }
    }
    get x() {
        return this._x;
    }
    set y(value) {
        if (typeof value === 'number') {
            this._y = value;
        }
        else {
            throw new TypeError("y must be a number");
        }
    }
    get y() {
        return this._y;
    }
}

//Polygon
canvideo.Polygon = class extends canvideo.Shape {
    constructor() {
        //Constructor: x1, y1, x2, y2, x3, y3, ...
        //Constructor: [ x1, y1 ], [ x2, y2 ], [ x3, y3 ], ...
        //Constructor: { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, ...

        var points = [];
        //Find out what type of constructor they are using
        var argTypes = [];
        for (var i = 0; i < 6; i++) {
            argTypes.push(typeof arguments[i]);
        }
        if (argTypes[0] === 'number' && argTypes[1] === 'number' && argTypes[2] === 'number' && argTypes[3] === 'number' && argTypes[4] === 'number' && argTypes[5] === 'number') {
            var i = 0;
            while (i < arguments.length) {
                if (typeof arguments[i] === 'number' && typeof arguments[i + 1] === 'number') {
                    points.push(new canvideo.Point({
                        x: arguments[i],
                        y: arguments[i + 1]
                    }));
                }
                else {
                    throw new TypeError("Invalid list arguements.");
                }
                i += 2;
            }
        }
        else if (argTypes[0] === 'object' && argTypes[1] === 'object' && argTypes[2] === 'object') {
            if (arguments[0] instanceof Array) {
                var i = 0;
                while (i < arguments.length) {
                    if (arguments[i] instanceof Array && typeof arguments[i][0] === 'number' && typeof arguments[i][1] === 'number') {
                        points.push(new canvideo.Polygon(arguments[i]));
                    }
                    else {
                        throw new TypeError("Invalid array arguements.");
                    }
                    i++;
                }
            }
            else {
                var i = 0;
                while (i < arguments.length) {
                    if (typeof arguments[i] === 'object' && typeof arguments[i].x === 'number' && typeof arguments[i].y === 'number') {
                        points.push(new canvideo.Polygon(arguments[i]));
                    }
                    else {
                        throw new TypeError("Invalid object arguements.");
                    }
                    i++;
                }
            }
        }
        else {
            throw new TypeError("Invalid constructor.");
        }
        super({ points }, layer);
        this.draw = function(ctx, frameNumber){
            var value = this.valueAt(frameNumber);
            ctx.beginPath();
            ctx.moveTo(value.points[0].x, value.points[0].y);
            for(var i = 1; i < value.points.length; i++){
                ctx.lineTo(value.points[i].x, value.points[i].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
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