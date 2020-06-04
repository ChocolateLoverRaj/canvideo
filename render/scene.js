//Manage a scene and add shapes

//Dependencies
const { createCanvas } = require('canvas');

//My Modules
const {
    typedFunction,
    Types,
    Overloader,
    Interface } = require("../type");
const { cameraInterface, Camera } = require("./camera");

//Add interface
const addInterface = new Interface(false)
    .optional("startTime", Types.NON_NEGATIVE_NUMBER)
    .optional("duration", Types.POSITIVE_NUMBER)
    .optional("layer", Types.NON_NEGATIVE_INTEGER)
    .toType();

//Size type
const sizeType = a => Number.isSafeInteger(a) && !(a & 1) ? false : "is not a valid size.";

//Render options interface
const renderOptions = new Interface(false)
    .required("fps", Types.POSITIVE_NUMBER)
    .required("width", sizeType)
    .required("height", sizeType)
    .toType();

//Shape interface
const shapeInterface = new Interface(true)
    .required("at", Types.FUNCTION)
    .toType();

//Scene class
class Scene {
    constructor() {
        this.drawables = [];
        this._camera = new Camera();
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
            .call(this, ...arguments);

        this.drawables.push(drawable);
        return this;
    };

    setCamera(camera) {
        this.camera = camera;
        return this;
    }

    render() {
        return typedFunction([
            { name: "frameNumber", type: Types.NON_NEGATIVE_INTEGER },
            { name: "options", type: renderOptions }
        ], function (fn, { fps, width, height }) {
            //Calculate time in seconds
            var s = 1 / fps * fn;

            //Create a new canvas
            var canvas = createCanvas(width, height);
            var ctx = canvas.getContext('2d');

            //Set the necessary transforms
            var { scaleX, scaleY, refX, refY, x, y } = this.camera.at(s);
            //Translate relative to camera position
            ctx.translate(-x, -y);
            //Translate to make scale relative to ref
            ctx.translate(-(refX * (scaleX - 1)), -(refY * (scaleY - 1)));
            //Scale
            ctx.scale(scaleX, scaleY);

            //Filter only shapes to draw
            function shapeIsInFrame({ startTime, endTime }) {
                return fn >= startTime * fps && fn < endTime;
            };

            //Sort by layer
            function sortLayer(a, b) {
                return a.layer - b.layer;
            };

            //Draw the drawables
            function draw({ shape }) {
                var shape = shape.at(1 / fps * fn);
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
            return canvas.toDataURL();
        }).apply(this, arguments);
    };
}

//Export the module
module.exports = Scene;