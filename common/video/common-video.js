//Render the final video

//Dependencies
import { EventEmitter } from "../event-emitter/event-emitter.js";
import Overloader from "../type/overloader.js";
import Types from "../type/types.js";
import { Interface } from "../type/interface.js";
import typedFunction from "../type/typed-function.js";
import instanceOf from "../type/instanceOf.js";
import { sizeType, regularSizeInterface, shortSizeInterface } from "./size.js";
import typify from "../properties/typify.js";
import Scene from "../scene/scene.js";

//Video options
const optionsInterface = new Interface(false)
    .required("width", sizeType)
    .required("height", sizeType)
    .required("fps", Types.POSITIVE_NUMBER)
    .toType();
const shortOptionsInterface = new Interface(false)
    .required("w", sizeType)
    .required("h", sizeType)
    .required("fps", Types.POSITIVE_NUMBER)
    .toType();

const squashedOptionsInterface = new Interface(false)
    .required("size", regularSizeInterface)
    .required("fps", Types.POSITIVE_NUMBER)
    .toType();
const shortSquashedOptionsInterface = new Interface(false)
    .required("size", shortSizeInterface)
    .required("fps", Types.POSITIVE_NUMBER)
    .toType();

//Video class
class Video extends EventEmitter {
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
                const propertiesToAdd = new Set()
                    .add("width")
                    .add("height")
                    .add("fps")
                    .add("scenes");
                var { width, height, fps, scenes } = json;
                for (var k in json) {
                    if (!propertiesToAdd.has(k)) {
                        throw new TypeError(`Unknown property: ${k}.`);
                    }
                }
                var video = new Video(width, height, fps);
                if (scenes instanceof Array) {
                    for (var i = 0; i < scenes.length; i++) {
                        video.add(Scene.fromJson(scenes[i], false, true, csMappings, caMappings));
                    }
                }
                else {
                    throw new TypeError("video.scenes is not an array.");
                }
                return video;
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
        super();
        typify(this, {
            width: sizeType,
            height: sizeType,
            fps: Types.POSITIVE_NUMBER,
            spf: {
                type: Types.POSITIVE_NUMBER,
                setter: function (v) {
                    this.fps = 1 / v;
                },
                getter: function () {
                    return 1 / this.fps;
                }
            }
        });
        new Overloader()
            .overload([{ type: sizeType }, { type: sizeType }, { type: Types.POSITIVE_NUMBER }], function (width, height, fps) {
                this.width = width, this.height = height, this.fps = fps;
            })
            .overload([{ type: regularSizeInterface }, { type: Types.POSITIVE_NUMBER }], function ({ width, height }, fps) {
                this.width = width, this.height = height, this.fps = fps;
            })
            .overload([{ type: shortSizeInterface }, { type: Types.POSITIVE_NUMBER }], function ({ w, h }, fps) {
                this.width = w, this.height = h, this.fps = fps;
            })
            .overload([{ type: optionsInterface }], function ({ width, height, fps }) {
                this.width = width, this.height = height, this.fps = fps;
            })
            .overload([{ type: shortOptionsInterface }], function ({ w, h, fps }) {
                this.width = w, this.height = h, this.fps = fps;
            })
            .overload([{ type: squashedOptionsInterface }], function ({ size: { width, height }, fps }) {
                this.width = width, this.height = height, this.fps = fps;
            })
            .overload([{ type: shortSquashedOptionsInterface }], function ({ size: { w, h }, fps }) {
                this.width = w, this.height = h, this.fps = fps;
            })
            .overloader.call(this, ...arguments);
        this.scenes = [];
    };

    get duration() {
        var d = 0;
        for (var i = 0; i < this.scenes.length; i++) {
            d += this.scenes[i].duration;
        }
        return d;
    }

    add() {
        typedFunction([{ name: "scene", type: instanceOf(Scene) }], function (scene) {
            this.scenes.push(scene);
        }).call(this, ...arguments);
        return this;
    }

    setWidth(width) {
        this.width = width;
        return this;
    }
    setHeight(height) {
        this.height = height;
        return this;
    }
    setSize() {
        new Overloader()
            .overload([{ type: sizeType }, { type: sizeType }], function (width, height) {
                this.width = width, this.height = height;
            })
            .overload([{ type: regularSizeInterface }], function ({ width, height }) {
                this.width = width, this.height = height;
            })
            .overload([{ type: shortSizeInterface }], function ({ w, h }) {
                this.width = w, this.height = h;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    setFps(fps) {
        this.fps = fps;
        return this;
    }
    setSpf(spf) {
        this.spf = spf;
        return this;
    }

    toJson(stringify = true, fps = this.fps) {
        var o = {
            width: this.width,
            height: this.height,
            fps: this.fps,
            scenes: []
        };
        for (var i = 0; i < this.scenes.length; i++) {
            o.scenes.push(this.scenes[i].toJson(false, fps));
        }

        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be boolean.");
        }
    }
}

export default Video;