//Manage a scene and add shapes

//Dependencies
const { createCanvas } = require('canvas');

//Npm Modules
const tinyColor = require('tinycolor2');

//My Modules
const {
    typedFunction,
    Types,
    Overloader,
    Interface } = require("../type");
const Camera = require("./camera");
const { sizeInterface } = require("./size");
const colorType = require("./color");
const shapeInterface = require("../shapes/shape-interface");
const typify = require("../properties/typify");
const cameraInterface = require("./camera-interface");
const shapes = require("../shapes/shapes");

//Config
const defaultDuration = 5;

//Add interface
const addInterface = new Interface(false)
    .optional("startTime", Types.NON_NEGATIVE_NUMBER)
    .optional("duration", Types.POSITIVE_NUMBER)
    .optional("layer", Types.NON_NEGATIVE_INTEGER)
    .toType();

//Scene class
class Scene {
    static fromJson(json, parse = true, throwErrors = false) {
        if (typeof throwErrors !== 'boolean') {
            throw new TypeError("throwErrors must be a boolean.");
        }
        if (typeof json === 'string' && parse === true) {
            try {
                json = JSON.parse(json);
            }
            catch (e) {
                if (throwErrors) {
                    throw e;
                }
                else {
                    return false;
                }
            }
        }
        else if (parse !== false) {
            throw new TypeError("json and parse arguments do not fit together.");
        }
        try {
            if (typeof json === 'object') {
                var { backgroundColor, drawables } = json;
                const propertiesToAdd = new Set()
                    .add("backgroundColor")
                    .add("drawables");
                for (var k in json) {
                    if (!propertiesToAdd.has(k)) {
                        throw new TypeError(`Unknown property: ${k}.`);
                    }
                }
                var scene = new Scene().setBackgroundColor(backgroundColor);
                if (drawables instanceof Array) {
                    for (var i = 0; i < drawables.length; i++) {
                        let { startTime, endTime, layer, shape: { isBuiltin, name, data } } = drawables[i];
                        if(isBuiltin){
                            scene.add(startTime, endTime - startTime, layer, shapes.fromJson(name, data, false, true));
                        }
                    }
                }
                else {
                    throw new TypeError("scene.drawables is not an array.");
                }
                return scene;
            }
            else {
                throw new TypeError("video is not an object.");
            }
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    }

    constructor() {
        typify(this, {
            backgroundColor: {
                type: colorType,
                initial: tinyColor("white"),
                setter: function (v, set) {
                    if (typeof v === 'object') {
                        set(tinyColor(Object.assign(this._backgroundColor.toRgb(), v)));
                    }
                    else {
                        set(tinyColor(v));
                    }
                },
                getter: function () {
                    var rgb = this._backgroundColor.toRgb();
                    rgb.hexString = this._backgroundColor.toHexString();
                    return rgb;
                }
            }
        })
        this.drawables = [];
        this._camera = new Camera();
        this._duration = 0;
        this.autoDuration = 0;
    }

    set camera(camera) {
        return typedFunction([{ name: "camera", type: cameraInterface, optional: false }], function (camera) {
            this._camera = camera;
            return this;
        }).call(this, camera);
    }
    get camera() {
        return this._camera;
    }

    set duration(duration) {
        return typedFunction([{ name: "duration", type: Types.POSITIVE_NUMBER }], function (duration) {
            this._duration = duration;
            return this;
        }).call(this, duration);
    }
    get duration() {
        var duration = this._duration || this.autoDuration;
        return duration !== Infinity ? duration : defaultDuration;
    }

    add() {
        var drawable = {
            startTime: 0,
            endTime: Infinity,
            layer: 0
        }

        new Overloader()
            .overload([
                { type: shapeInterface }
            ], function (shape) {
                drawable.shape = shape;
            })
            .overload([
                { type: Types.NON_NEGATIVE_NUMBER },
                { type: shapeInterface }
            ], function (startTime, shape) {
                drawable.startTime = startTime;
                drawable.shape = shape;
            })
            .overload([
                { type: Types.NON_NEGATIVE_NUMBER },
                { type: Types.POSITIVE_NUMBER },
                { type: shapeInterface }
            ], function (startTime, duration, shape) {
                drawable.startTime = startTime;
                drawable.endTime = startTime + duration;
                drawable.shape = shape;
            })
            .overload([
                { type: Types.NON_NEGATIVE_NUMBER },
                { type: Types.POSITIVE_NUMBER },
                { type: Types.NON_NEGATIVE_INTEGER },
                { type: shapeInterface }
            ], function (startTime, duration, layer, shape) {
                drawable.startTime = startTime;
                drawable.endTime = startTime + duration;
                drawable.layer = layer;
                drawable.shape = shape;
            })
            .overload([
                { type: addInterface },
                { type: shapeInterface }
            ], function ({ startTime, duration, layer }, shape) {
                drawable.startTime = startTime || 0;
                drawable.endTime = drawable.startTime + (duration || Infinity);
                drawable.layer = layer || 0;
                drawable.shape = shape;
            })
            .overloader.call(this, ...arguments);

        this.autoDuration = Math.max(this.autoDuration, drawable.endTime);
        this.drawables.push(drawable);
        return this;
    };

    setBackgroundColor(color) {
        this.backgroundColor = color;
        return this;
    }

    setCamera(camera) {
        this.camera = camera;
        return this;
    };

    render() {
        const atType = a => {
            let err = Types.NON_NEGATIVE_NUMBER(a);
            if (!err) {
                if (a < this.duration) {
                    return false;
                }
                else {
                    return `must be less than the scene duration: ${this.duration}.`;
                }
            }
            else {
                return err;
            }
        }
        return typedFunction([
            { name: "at", type: atType },
            { name: "size", type: sizeInterface }
        ], function (at, { width, height }) {
            //Create a new canvas
            var canvas = createCanvas(width, height);
            var ctx = canvas.getContext('2d');

            //Set ctx special properties
            ctx.now = at;

            //Draw the background
            ctx.fillStyle = this.backgroundColor.hexString;
            ctx.fillRect(0, 0, width, height);

            //Set the default settings
            ctx.fillStyle = "black";
            ctx.strokeStyle = "none";
            ctx.lineWidth = 1;

            //Set the necessary transforms
            var { scaleX, scaleY, refX, refY, x, y } = this.camera.at(at);
            //Translate relative to camera position
            ctx.translate(-x, -y);
            //Translate to make scale relative to ref
            ctx.translate(-(refX * (scaleX - 1)), -(refY * (scaleY - 1)));
            //Scale
            ctx.scale(scaleX, scaleY);

            //Filter only shapes to draw
            function shapeIsInFrame({ startTime, endTime }) {
                return at >= startTime && at < endTime;
            };

            //Sort by layer
            function sortLayer(a, b) {
                return a.layer - b.layer;
            };

            //Draw the drawables
            function draw({ shape }) {
                var shape = shape.at(at);
                if (typeof shape.draw === 'function') {
                    shape.draw(ctx);
                }
                else {
                    throw new TypeError(`All drawables must have a draw method.`);
                }
            };

            //Draw filtered and sorted drawables
            this.drawables.filter(shapeIsInFrame).sort(sortLayer).map(draw);

            //Return dataUrl
            return canvas.createPNGStream();
        }).apply(this, arguments);
    };

    setDuration(duration) {
        this.duration = duration;
        return this;
    };

    toJson(stringify = true, fps = 60) {
        let o = {
            backgroundColor: this.backgroundColor.hexString,
            drawables: []
        };
        for (var i = 0; i < this.drawables.length; i++) {
            let { startTime, endTime, layer, shape } = this.drawables[i];
            o.drawables.push({
                startTime,
                endTime,
                layer,
                shape: {
                    isBuiltin: shapes.isBuiltin(shape),
                    name: shape.shapeName,
                    data: shape.toJson(false, fps)
                }
            });
        }
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Export the module
module.exports = Scene;