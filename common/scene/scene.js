//Manage a scene and add shapes

//Dependencies
import tinyColor from "../color/tiny-color.js";
import { createCanvas } from "../canvas/canvas.js";
import typedFunction from "../type/typed-function.js";
import Types from "../type/types.js";
import Overloader from "../type/overloader.js";
import { Interface } from "../type/interface.js";
import instanceOf from "../type/instanceOf.js";
import Camera from "../camera/camera.js";
import colorType from "../color/color.js";
import typify from "../properties/typify.js";
import cameraInterface from "../camera/camera-interface.js";
import {
    fromJson as shapeFromJson,
    isBuiltin as isShapeBuiltin
} from "../shapes/shapes.js";
import Shape from "../shapes/shape.js";
import Caption from "../captions/caption.js";

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
                var { backgroundColor, camera, drawables, captions } = json;
                var scene = new Scene()
                    .setBackgroundColor(backgroundColor)
                    .setCamera(Camera.fromJson(camera, false, true));
                if (drawables instanceof Array) {
                    for (var i = 0; i < drawables.length; i++) {
                        let { startTime, endTime, layer, shape: { isBuiltin, name, data } } = drawables[i];
                        if (isBuiltin) {
                            scene.add(startTime, endTime - startTime, layer, shapeFromJson(name, data, false, true, csMappings, caMappings));
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
                for (let id in captions) {
                    scene.add(id, Caption.fromJson(captions[id], false, true));
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

    render(at, { width, height }, ctx = createCanvas(width, height).getContext('2d')) {
        if (!(0 < at < this.duration)) {
            throw new TypeError("At is out of range.");
        }
        if (!(width > 0 && width < Infinity) || width & 1) {
            throw new TypeError("Invalid width.");
        }
        if (!(height > 0 && height < Infinity) || height & 1) {
            throw new TypeError("Invalid width.");
        }
        if (Types.CANVAS_CTX(ctx)) {
            throw new TypeError("Invalid Canvas Ctx.");
        }

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
        const shapeIsInFrame = ({ startTime, endTime }) => at >= startTime && at < endTime;

        //Sort by layer
        const sortLayer = (a, b) => a.layer - b.layer;

        //Map the shapes to their hashes
        let drawables = this.drawables.filter(shapeIsInFrame).sort(sortLayer);

        //Draw filtered and sorted drawables
        for (let i = 0; i < drawables.length; i++) {
            drawables[i].shape.at(at).draw(ctx);
        }

        return ctx;
    }

    setDuration(duration) {
        this.duration = duration;
        return this;
    };

    toJson(stringify = true, fps = 60) {
        let o = {
            backgroundColor: this.backgroundColor.hexString,
            drawables: [],
            captions: {},
            camera: this.camera.toJson(false)
        };
        for (var i = 0; i < this.drawables.length; i++) {
            let { startTime, endTime, layer, shape } = this.drawables[i];
            o.drawables.push({
                startTime,
                endTime,
                layer,
                shape: {
                    isBuiltin: isShapeBuiltin(shape),
                    name: shape.shapeName,
                    data: shape.toJson(false, fps)
                }
            });
        }
        for (let [id, caption] of this.captions) {
            o.captions[id] = caption.toJson(false);
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

export default Scene;