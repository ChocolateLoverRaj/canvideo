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
    Interface,
    instanceOf } = require("../type");
const Camera = require("./camera");
const { sizeInterface } = require("./size");
const colorType = require("./color");
const typify = require("../properties/typify");
const cameraInterface = require("./camera-interface");
const shapes = require("../shapes/shapes");
const Shape = require("../shapes/shape");
const Caption = require("../caption");

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
    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "csMappings", type: instanceOf(Map), optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, csMappings = new Map(), caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            if (typeof json === 'object') {
                var { backgroundColor, camera, drawables } = json;
                var scene = new Scene()
                    .setBackgroundColor(backgroundColor)
                    .setCamera(Camera.fromJson(camera, false, true));
                if (drawables instanceof Array) {
                    for (var i = 0; i < drawables.length; i++) {
                        let { startTime, endTime, layer, shape: { isBuiltin, name, data } } = drawables[i];
                        if (isBuiltin) {
                            scene.add(startTime, endTime - startTime, layer, shapes.fromJson(name, data, false, true, csMappings, caMappings));
                        }
                        else if (csMappings.has(name)) {
                            scene.add(startTime, endTime - startTime, layer, csMappings.get(name)(data, false, true, csMappings, caMappings));
                        }
                        else {
                            throw new TypeError(`Unmapped custom shape name: ${name}.`);
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
    });

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
        this.captions = new Map();
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

        const addShape = () => {
            this.autoDuration = Math.max(this.autoDuration, drawable.endTime);
            this.drawables.push(drawable);
        };

        const addCaption = (id, caption) => {
            this.captions.set(id, caption);
        };

        new Overloader()
            //Add Shape overloads
            .overload([
                { type: instanceOf(Shape) }
            ], function (shape) {
                drawable.shape = shape;
                addShape();
            })
            .overload([
                { type: Types.NON_NEGATIVE_NUMBER },
                { type: instanceOf(Shape) }
            ], function (startTime, shape) {
                drawable.startTime = startTime;
                drawable.shape = shape;
                addShape();
            })
            .overload([
                { type: Types.NON_NEGATIVE_NUMBER },
                { type: Types.POSITIVE_NUMBER },
                { type: instanceOf(Shape) }
            ], function (startTime, duration, shape) {
                drawable.startTime = startTime;
                drawable.endTime = startTime + duration;
                drawable.shape = shape;
                addShape();
            })
            .overload([
                { type: Types.NON_NEGATIVE_NUMBER },
                { type: Types.POSITIVE_NUMBER },
                { type: Types.NON_NEGATIVE_INTEGER },
                { type: instanceOf(Shape) }
            ], function (startTime, duration, layer, shape) {
                drawable.startTime = startTime;
                drawable.endTime = startTime + duration;
                drawable.layer = layer;
                drawable.shape = shape;
                addShape();
            })
            .overload([
                { type: addInterface },
                { type: instanceOf(Shape) }
            ], function ({ startTime, duration, layer }, shape) {
                drawable.startTime = startTime || 0;
                drawable.endTime = drawable.startTime + (duration || Infinity);
                drawable.layer = layer || 0;
                drawable.shape = shape;
                addShape();
            })

            //Add caption overloads
            .overload([
                { type: instanceOf(Caption) }
            ], function (caption) {
                var n = 0;
                var id;
                do {
                    id = `Caption Track ${n}`;
                    n++;
                }
                while (this.captions.has(id));
                addCaption(id, caption);
            })
            .overload([
                { type: Types.STRING },
                { type: instanceOf(Caption) }
            ], addCaption)
            .overloader.call(this, ...arguments);
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
            this.drawables.filter(shapeIsInFrame).sort(sortLayer).forEach(draw);

            //Return dataUrl
            return canvas.createPNGStream();
        }).apply(this, arguments);
    };

    hashAt(t) {
        if (!(t >= 0 && t < this.duration)) {
            throw new TypeError("Time is out of range.");
        }

        //Filter only shapes to draw
        const shapeIsInFrame = ({ startTime, endTime }) => t >= startTime && t < endTime;

        //Sort by layer
        const sortLayer = (a, b) => a.layer - b.layer;

        //Map the shapes to their hashes
        let drawables = this.drawables.filter(shapeIsInFrame).sort(sortLayer);
        let hash = [];
        for (let i = 0; i < drawables.length; i++) {
            let { shape } = drawables[i];
            hash.push({
                shape,
                hash: shape.at(t).getHash()
            });
        }
        return hash;
    }

    *getRender(fps, { width, height }, minCacheShapes = 1) {//TODO change minCacheShapes default to 150
        if (!(0 < fps < Infinity)) {
            throw new TypeError("fps must be a number between 0 and Infinity.");
        }
        if (!(width > 0 && width < Infinity) || width & 1) {
            throw new TypeError("Invalid width.");
        }
        if (!(height > 0 && height < Infinity) || height & 1) {
            throw new TypeError("Invalid width.");
        }
        if (!(Number.isSafeInteger(minCacheShapes) && minCacheShapes > 0 || minCacheShapes === false)) {
            throw new TypeError("If specified, minCacheShapes should be a safe positive integer.");
        }
        let hashes = new Map();
        let partHashes = new Map();
        let frameCount = this.duration * fps;
        for (let f = 0; f < frameCount; f++) {
            let t = f / fps;
            let hash = this.hashAt(t);

            //Filter only shapes to draw
            const shapeIsInFrame = ({ startTime, endTime }) => {
                return t >= startTime && t < endTime;
            };

            //Sort by layer
            const sortLayer = (a, b) => {
                return a.layer - b.layer;
            };

            //Get sorted and filtered shapes
            const filterShapes = () => this.drawables.filter(shapeIsInFrame).sort(sortLayer);

            //Get a transformed canvas, ready to draw on.
            const transformedCanvas = () => {
                //Create a new canvas
                let canvas = createCanvas(width, height);
                let ctx = canvas.getContext('2d');

                //Set the default settings
                ctx.fillStyle = "black";
                ctx.strokeStyle = "none";
                ctx.lineWidth = 1;

                //Set the necessary transforms
                var { scaleX, scaleY, refX, refY, x, y } = this.camera.at(t);
                //Translate relative to camera position
                ctx.translate(-x, -y);
                //Translate to make scale relative to ref
                ctx.translate(-(refX * (scaleX - 1)), -(refY * (scaleY - 1)));
                //Scale
                ctx.scale(scaleX, scaleY);

                return canvas;
            };

            let same = false;
            let sameAs;
            PastFrames:
            for (let i = 0; i < f; i++) {
                if (hashes.has(i)) {
                    let already = hashes.get(i);
                    if (already.length === hash.length) {
                        for (let j = 0; j < hash.length; j++) {
                            let { shape: aShape, hash: aHash } = already[j];
                            let { shape: nShape, hash: nHash } = hash[j];
                            if (aShape === nShape && aHash === nHash) {
                                same = true, sameAs = i;
                                break PastFrames;
                            }
                        }
                    }
                }
            }
            if (same) {
                yield sameAs;
            }
            else {
                //Set the hash
                hashes.set(f, hash);

                //Check to see if we should cache anything
                console.log("frame", f);
                if (minCacheShapes && hash.length >= minCacheShapes) {
                    for (let i = f + 1; i < frameCount; i++) {
                        let frameHash = this.hashAt(i / fps);
                        let lastStartShape = frameHash.length - minCacheShapes;
                        let included = new Set();
                        if (frameHash.length >= minCacheShapes) {
                            for (let j = 0; j <= hash.length - minCacheShapes; j++) {
                                let { shape: nowShape, hash: nowHash } = hash[j];
                                for (let k = 0; k <= lastStartShape; k++) {
                                    if(included.has(k)){
                                        continue;
                                    }
                                    if (nowShape === frameHash[k].shape && nowHash === frameHash[k].hash) {
                                        included.add(k);
                                        let common = 1;
                                        for(k++; k <= lastStartShape && j + common < hash.length; k++) {
                                            if(included.has(k)){
                                                continue;
                                            }
                                            let { shape: nowShape, hash: nowHash } = hash[j + common];
                                            if (nowShape === frameHash[k].shape && nowHash === frameHash[k].hash) {
                                                included.add(k);
                                                common++;
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                        console.log("common", f, i, j, common);
                                        if(common >= minCacheShapes){
                                            //TODO actually store a canvas
                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                //Create a new canvas
                let canvas = createCanvas(width, height);
                let ctx = canvas.getContext('2d');

                //Draw the background
                ctx.fillStyle = this.backgroundColor.hexString;
                ctx.fillRect(0, 0, width, height);

                //Set the default settings
                ctx.fillStyle = "black";
                ctx.strokeStyle = "none";
                ctx.lineWidth = 1;

                //Set the necessary transforms
                var { scaleX, scaleY, refX, refY, x, y } = this.camera.at(t);
                //Translate relative to camera position
                ctx.translate(-x, -y);
                //Translate to make scale relative to ref
                ctx.translate(-(refX * (scaleX - 1)), -(refY * (scaleY - 1)));
                //Scale
                ctx.scale(scaleX, scaleY);

                //Draw filtered and sorted drawables
                for (let i = 0; i < hash.length; i++) {
                    hash[i].shape.at(t).draw(ctx);
                }

                //Return the canvas
                yield canvas;
            }
        }
    }

    setDuration(duration) {
        this.duration = duration;
        return this;
    };

    toJson(stringify = true, fps = 60) {
        let o = {
            backgroundColor: this.backgroundColor.hexString,
            drawables: [],
            camera: this.camera.toJson(false)
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