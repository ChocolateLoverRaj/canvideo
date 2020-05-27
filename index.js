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
        if (typeof defaultValue === 'object') {
            this.defaultValue = defaultValue;
            this.changes = new Map();
            this.changesToAdd = [];
            this.animations = new Map();
            this.currentAnimations = [];
            if (typeof setVideo === 'function') {
                this.setVideo = setVideo;
            }
            else if (typeof setVideo === 'undefined') {
                this.setVideo = function (value) { };
            }
            else {
                throw new TypeError("Invalid constructor.");
            }
            this._extendUntil = 0;
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
                this.video.extendUntil = endTime;
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
    set extendUntil(value) {
        if (typeof value === 'number') {
            this._extendUntil = Math.max(this._extendUntil, value);
        }
        else {
            throw new TypeError("extendUntil time must be a number (in seconds).");
        }
    }
    get extendUntil() {
        return this._extendUntil;
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
        super(helper.recursiveAssign(
            {
                _layer: layer,
                set layer(value) {
                    if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) {
                        this._layer = value;
                    }
                    else {
                        throw new TypeError("layer must be a non negative integer.");
                    }
                },
                get layer() {
                    return this._layer;
                },
                _fillColor: undefined,
                set fillColor(value) {
                    if (typeof value === 'object') {
                        this._fillColor = helper.recursiveAssign(this.fillColor, value);
                    }
                    else {
                        this._fillColor = new canvideo.Color(value);
                    }
                },
                get fillColor() {
                    return this._fillColor;
                },
                _strokeColor: undefined,
                set strokeColor(value) {
                    if (typeof value === 'object') {
                        this.stroke_Color = helper.recursiveAssign(this.strokeColor, value);
                    }
                    else {
                        this._strokeColor = new canvideo.Color(value);
                    }
                },
                get strokeColor() {
                    return this._strokeColor;
                },
                _strokeWidth: undefined,
                set strokeWidth(value = 0) {
                    if (typeof value === 'number' && value >= 0) {
                        this._strokeWidth = value;
                    }
                    else {
                        throw new TypeError("strokeWidth must be a non negative number.");
                    }
                },
                get strokeWidth() {
                    return this._strokeWidth;
                }
            }, defaultValue), function (value) {
                this.deleteFrame = this.video.frameAtTime(this.deleteTime);
            });
        this.layer = layer;
        this.fillColor = undefined;
        this.strokeColor = undefined;
        this.strokeWidth = undefined;
        this.deleteFrame = Infinity;
        this.deleteTime = Infinity;
    };

    set layer(value) {
        this.defaultValue.layer = value;
    }
    get layer() {
        return this.defaultValue.layer;
    }
    set fillColor(value) {
        this.defaultValue.fillColor = value;
    }
    get fillColor() {
        return this.defaultValue.fillColor;
    }
    set strokeColor(value) {
        this.defaultValue.strokeColor = value;
    }
    get strokeColor() {
        return this.defaultValue.strokeColor;
    }
    set strokeWidth(value = 0) {
        this.defaultValue.strokeWidth = value;
    }
    get strokeWidth() {
        return this.defaultValue.strokeWidth;
    }
    set frameNumber(value) {
        if (Number.isSafeInteger(value) && value >= 0) {
            this._frameNumber = value;
        }
        else {
            throw new TypeError("frameNumber must be non negative integer.");
        }
    }
    get frameNumber() {
        return this._frameNumber;
    }

    draw(ctx, value) {
        ctx.fillStyle = value.fillColor.toString();
        ctx.strokeStyle = value.strokeColor.toString();
        ctx.strokeWidth = value.strokeWidth;
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
    inLayer(layer) {
        this.layer = layer;
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
        super({
            _x: undefined,
            set x(value) {
                if (typeof value === 'number') {
                    this._x = value;
                }
                else {
                    throw new TypeError("x must be a number.");
                }
            },
            get x() {
                return this._x;
            },
            _y: undefined,
            set y(value) {
                if (typeof value === 'number') {
                    this._y = value;
                }
                else {
                    throw new TypeError("y must be a number.");
                }
            },
            get y() {
                return this._y;
            },
            _width: undefined,
            set width(value) {
                if (typeof value === 'number') {
                    this._width = value;
                }
                else {
                    throw new TypeError("width must be a number.");
                }
            },
            get width() {
                return this._width;
            },
            _height: undefined,
            set height(value) {
                if (typeof value === 'number') {
                    this._height = value;
                }
                else {
                    throw new TypeError("height must be a number.");
                }
            },
            get height() {
                return this._height;
            }
        }, layer);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    set x(value) {
        this.defaultValue.x = value;
    }
    get x() {
        return this.defaultValue.x;
    }
    set y(value) {
        this.defaultValue.y = value;
    }
    get y() {
        return this.defaultValue.y;
    }
    set width(value) {
        this.defaultValue.width = value;
    }
    get width() {
        return this.defaultValue.width;
    }
    set height(value) {
        this.defaultValue.height = value;
    }
    get height() {
        return this.defaultValue.height;
    }

    draw(ctx, value) {
        super.draw(ctx, value)
        ctx.fillRect(value.x, value.y, value.width, value.height);
        if (this.strokeWidth > 0) {
            ctx.strokeRect(value.x, value.y, value.width, value.height);
        }
        return this;
    };
}

//Square
canvideo.Square = class extends canvideo.Shape {
    constructor(x = 0, y = 0, size = 100, layer) {
        super({
            _x: undefined,
            set x(value) {
                if (typeof value === 'number') {
                    this._x = value;
                }
                else {
                    throw new TypeError("x must be a number.");
                }
            },
            get x() {
                return this._x;
            },
            _y: undefined,
            set y(value) {
                if (typeof value === 'number') {
                    this._y = value;
                }
                else {
                    throw new TypeError("y must be a number.");
                }
            },
            get y() {
                return this._y;
            },
            size: undefined,
            set size(value) {
                if (typeof value === 'number') {
                    this._size = value;
                }
                else {
                    throw new TypeError("size must be a number.");
                }
            },
            get size() {
                return this._size;
            }
        }, layer);
        this.x = x;
        this.y = y;
        this.size = size;
    }

    set x(value) {
        this.defaultValue.x = value;
    }
    get x() {
        return this.defaultValue.x;
    }
    set y(value) {
        this.defaultValue.y = value;
    }
    get y() {
        return this.defaultValue.y;
    }
    set size(value) {
        this.defaultValue.size = value;
    }
    get size() {
        return this.defaultValue.size;
    }

    draw(ctx, value) {
        super.draw(ctx, value);
        ctx.fillRect(value.x, value.y, value.size, value.size);
        if (this.strokeWidth > 0) {
            ctx.strokeRect(value.x, value.y, value.size, value.size);
        }
        return this;
    };
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
        super(
            {
                _points: points,
                set points(value) {
                    if (value instanceof Array) {
                        var newPoints = []
                        for (var i = 0; i < value.length; i++) {
                            if (value[i] instanceof canvideo.Point) {
                                newPoints.push(value[i]);
                            }
                            else {
                                newPoints.push(new canvideo.Point(value[i]));
                            }
                        }
                        this._points = newPoints;
                    }
                    else {
                        throw new TypeError("points must be an array of points.");
                    }
                },
                get points() {
                    return this._points;
                }
            }
        );
        this.points = points;
    }

    set points(value) {
        this.defaultValue.points = value;
    }
    get points() {
        return this.defaultValue.points;
    }

    draw(ctx, value) {
        super.draw(ctx, value);
        ctx.beginPath();
        ctx.moveTo(value.points[0].x, value.points[0].y);
        for (var i = 1; i < value.points.length; i++) {
            ctx.lineTo(value.points[i].x, value.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
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
        this._extendUntil = 0;
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
            for (var i = 0; i < this.shapes.length; i++) {
                this.shapes.frameNumber = this.frameNumber;
            }
        }
        else {
            throw new TypeError("frameNumber must be a number.");
        }
    }
    get frameNumber() {
        return this._frameNumber;
    }
    set extendUntil(value) {
        if (typeof value === 'number') {
            this._extendUntil = Math.max(this._extendUntil, value);
        }
        else {
            throw new TypeError("extendUntil time must be a number (in seconds).");
        }
    }
    get extendUntil() {
        return this._extendUntil;
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
                var aLayer = a.valueAt(this.frameNumber).layer, bLayer = b.valueAt(this.frameNumber).layer;
                if (aLayer === bLayer) {
                    if (a.frameNumber === b.frameNumber) {
                        return a.shapeIndex - b.shapeIndex;
                    }
                    else {
                        return a.frameNumber - b.frameNumber;
                    }
                }
                else {
                    return a.valueAt(this.frameNumber).layer - b.valueAt(this.frameNumber).layer;
                }
            };

            var shapesToRender = shapes.concat(this.shapes).sort(sorter.bind(this));

            var canvas = createCanvas(this.video.width, this.video.height);
            var ctx = canvas.getContext('2d');
            //Set stuff based on camera
            var camera = this.video.camera.valueAt(this.frameNumber);
            var csx = camera.scaleX, csy = camera.scaleY;
            var crx = camera.refX, cry = camera.refY;

            ctx.translate(-camera.x, -camera.y);
            ctx.translate(-(crx * csx - crx), -(cry * csy - cry));
            ctx.scale(csx, csy);
            //Loop through and draw all the shapes
            for (var i = 0; i < shapesToRender.length; i++) {
                shapesToRender[i].draw(ctx, shapesToRender[i].valueAt(this.frameNumber), camera);
            }
            var framePath = this.video.tempPath + "/frame" + this.frameNumber + ".jpg";

            return {
                promise: new Promise((resolve, reject) => {
                    canvas.createJPEGStream()
                        .on("end", () => {
                            resolve();
                        })
                        .on("error", err => {
                            reject(err);
                        })
                        .pipe(fs.createWriteStream(framePath));
                }),
                shapes: shapesToRender
            };
        }
        else {
            throw new TypeError("this.frameNumber is not a number");
        }
    }
}

//Zoom Linear Animation
canvideo.ZoomAnimation = class extends canvideo.Animation {
    constructor(startZoom, endZoom, arg1, arg2) {
        if (typeof startZoom === 'object' && typeof startZoom.scaleX === 'number' && typeof startZoom.scaleY === 'number' && typeof endZoom === 'object' && typeof endZoom.scaleX === 'number' && typeof endZoom.scaleY === 'number') {
            var refX, refY;
            if (typeof arg1 === 'number' && typeof arg2 === 'number') {
                refX = arg1, refY = arg2;
            }
            else if (typeof arg1 === 'object' && typeof arg1.x === 'number' && typeof arg1.y === 'number' && typeof arg2 === 'undefined') {
                refX = arg1.x, refY = arg1.y;
            }
            else if (arg1 instanceof Array && typeof arg1[0] === 'number' && typeof arg1[1] === 'number' && typeof arg2 === 'undefined') {
                [refX, refY] = arg1;
            }
            else {
                throw new TypeError("Invalid syntax for reference point.");
            }
            var startValue = {
                scaleX: startZoom.scaleX,
                scaleY: startZoom.scaleY,
                refX: refX,
                refY: refY
            };
            var endValue = {
                scaleX: endZoom.scaleX,
                scaleY: endZoom.scaleY,
                refX: refX,
                refY: refY
            };
            super(startValue, endValue);
        }
        else {
            throw new TypeError("Invalid startZoom or endZoom.");
        }
    };
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
        this.width = width;
        this.height = height;
        this.fps = fps;
        this.exported = false;
        this._extendUntil = 0;
        this.camera = new canvideo.Animanager({
            _x: 0,
            set x(value) {
                if (typeof value === 'number') {
                    this._x = value;
                }
                else {
                    throw new TypeError("x must be a numbe");
                }
            },
            get x() {
                return this._x;
            },
            _y: 0,
            set y(value) {
                if (typeof value === 'number') {
                    this._y = value;
                }
                else {
                    throw new TypeError("y must be a numbe");
                }
            },
            get y() {
                return this._y;
            },
            _scaleX: 0,
            set scaleX(value) {
                if (typeof value === 'number') {
                    this._scaleX = value;
                }
                else {
                    throw new TypeError("scaleX must be a numbe");
                }
            },
            get scaleX() {
                return this._scaleX;
            },
            _scaleY: 0,
            set scaleY(value) {
                if (typeof value === 'number') {
                    this._scaleY = value;
                }
                else {
                    throw new TypeError("scaleY must be a numbe");
                }
            },
            get scaleY() {
                return this._scaleY;
            },
            _refX: 0,
            set refX(value) {
                if (typeof value === 'number') {
                    this._refX = value;
                }
                else {
                    throw new TypeError("refX must be a numbe");
                }
            },
            get refX() {
                return this._refX;
            },
            _refY: 0,
            set refY(value) {
                if (typeof value === 'number') {
                    this._refY = value;
                }
                else {
                    throw new TypeError("refY must be a numbe");
                }
            },
            get refY() {
                return this._refY;
            },
        });

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
    set extendUntil(value) {
        if (typeof value === 'number') {
            this._extendUntil = Math.max(this._extendUntil, value);
        }
        else {
            throw new TypeError("extendUntil time must be a number (in seconds).");
        }
    }
    get extendUntil() {
        return this._extendUntil;
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
    export(filePath, callback) {
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
        if(!((typeof callback === 'function' && callback.length === 0) || (typeof callback === 'undefined'))){
            throw new TypeError("If callback is specified it must be a function which takes 0 args.");
        }

        //Set camera's video
        this.camera.video = this;

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

        //Extend video further than last keyframe to render animations
        while (this.keyframes.length < this.extendUntil * this.fps) {
            this.addKeyframe(new canvideo.Keyframe(this.keyframes.length * this.spf));
        }

        //Render a keyframe
        this.exported = true;
        var promises = [];
        var previousShapes = [];
        for (var i = 0; i < this.keyframes.length; i++) {
            var { shapes, promise } = this.keyframes[i].render(shapes);
            previousShapes = shapes;
            promises.push(promise);
        }
        return Promise.all(promises)
            .then(() => {
                this.emit("done");
                if(callback){
                    callback();
                }
            })
            .catch(err => {
                this.emit("error", err);
            });
    }
}

//Export the module
module.exports = canvideo;