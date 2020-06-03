//Manage a scene and add shapes

//Dependencies
//Npm Modules
const { createCanvas } = require('canvas');

//My Modules
const {
    typedFunction,
    Types,
    Overloader,
    Interface } = require("./type");

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
const shapeInterface = new Interface()
    .required("at", Types.FUNCTION)
    .toType();

//Scene class
class Scene {
    constructor() {
        this.drawables = [];
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

    render() {
        return typedFunction([
            { name: "frameNumber", type: Types.NON_NEGATIVE_INTEGER },
            { name: "options", type: renderOptions }
        ], function (fn, { fps, width, height }) {

            //Create a new canvas
            var canvas = createCanvas(width, height);
            var ctx = canvas.getContext('2d');

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
                shape.at(1 / fps * fn).draw(ctx);
            };

            //Draw filtered and sorted drawables
            this.drawables.filter(shapeIsInFrame).sort(sortLayer).map(draw);

            //Return dataUrl
            return canvas.toDataURL();
        }).apply(this, arguments);
    }
}

const Rectangle = require("./shapes/rectangle");
const Animation = require("./animation");
const fs = require('fs');

var s = new Scene();

s
    .add(new Rectangle(0, 0, 200, 200)
        .fill("mediumSeaGreen")
    )
    .add(new Rectangle(100, 100, 200, 200)
        .fill("dodgerBlue")
        .stroke("yellow")
    );

fs.writeFileSync("./temp/0.png", Buffer.from(s.render(1, { fps: 2, width: 400, height: 400 }).split(',')[1], 'base64'));