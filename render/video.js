//Render the final video

//Dependencies
//Node.js Modules
const fs = require('fs');
const { EventEmitter } = require('events');
const path = require('path');

//Npm Modules
const ffmpeg = require('fluent-ffmpeg');

//My Modules
const { Overloader, Types, Interface, either, typedFunction } = require("../type");
const { sizeType, regularSizeInterface, shortSizeInterface, sizeInterface } = require("./size");
const Scene = require("./scene");

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

//Temp path
var tempPath;

//Set the global tempPath
async function setTempPath(path) {
    //Check if directory exists
    if (fs.existsSync(path)) {
        tempPath = new Promise((resolve, reject) => {
            fs.lstat(path, (err, stats) => {
                if (!err) {
                    if (stats.isDirectory()) {
                        resolve(path);
                    }
                    else {
                        throw new URIError(`directory: ${path}, is not a directory.`);
                    }
                }
                else {
                    throw new Error(`Error checking if directory exists: ${err}`);
                }
            });
        });
    }
    else {
        throw new URIError(`directory: ${path}, does not exist.`);
    }
}

//Video class
class Video extends EventEmitter {
    constructor() {
        super();
        this.tempPath = tempPath;
        this.duration = 0;
        new Overloader()
            .overload([{ type: sizeType }, { type: sizeType }, { type: Types.POSITIVE_NUMBER }], function (width, height, fps) {
                this.width = width, this.height = height, this.fps = fps;
            })
            .overload([{ type: sizeInterface }, { type: Types.POSITIVE_NUMBER }], function ({ width, height }, fps) {
                this.width = width, this.height = height, this.fps = fps;
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

    set spf(v) {
        this.fps = 1 / v;
    }
    get spf() {
        return 1 / this.fps;
    }

    add() {
        return typedFunction([{ name: "scene", type: Types.OBJECT }], function (scene) {
            if (typeof scene.render === 'function') {
                if (typeof scene.duration === 'number') {
                    this.duration += scene.duration;
                    this.scenes.push(scene);
                }
                else {
                    throw new TypeError("Scene must have a duration.");
                }
            }
            else {
                throw new TypeError("Scene must have a render function.");
            }
            return this;
        }).call(this, ...arguments);
    }

    setTempPath(path) {
        //Check if directory exists
        if (fs.existsSync(path)) {
            this.tempPath = fs.lstat(path, (err, stats) => {
                if (!err) {
                    if (stats.isDirectory()) {
                        return true;
                    }
                    else {
                        throw new URIError(`directory: ${path}, is not a directory.`);
                    }
                }
                else {
                    throw new Error(`Error checking if directory exists: ${err}`);
                }
            });
        }
        else {
            throw new URIError(`directory: ${path}, does not exist.`);
        }
    }

    export() {
        var start = function () {
            var emitter = new EventEmitter()
                .on("finish", () => {
                    this.emit("finished", emitter);
                })
                .on('error', err => {
                    this.emit('error', err, emitter);
                });
            if (this.tempPath) {
                var uriFromFrameNumber = function (frame) {
                    var time = frame * this.spf;
                    var startTime = 0;
                    for (var i = 0; i < this.scenes.length; i++) {
                        let scene = this.scenes[i];
                        if (time < startTime + scene.duration) {
                            return scene.render(time - startTime, { width: this.width, height: this.height });
                        }
                        else {
                            startTime += scene.duration;
                        }
                    }
                }.bind(this);

                var numberOfFrames = Math.ceil(this.duration * this.fps);
                this.tempPath.then(tempPath => {
                    var framePaths = [];
                    for (var i = 0; i < numberOfFrames; i++) {
                        var framePath = path.join(tempPath, `/${i}.png`);
                        framePaths.push(framePath);

                        let frame = uriFromFrameNumber(i);
                        let length = frame.toBuffer().byteLength;
                        let written = 0;
                        let frameStream = frame.createPNGStream();
                        let outStream = fs.createWriteStream(framePath, {encoding: "base64"});
                        let b = i;//TODO create progress stuff
                        frameStream.on('data', data => {
                            written += data.length;
                            outStream.write(data);
                            if(b === 0){
                                console.log(`Written ${written} out of ${length} bytes.`);
                            }
                        });
                    }
                    console.log(framePaths);
                });
            }
            else {
                throw new ReferenceError("tempPath must be set before exporting.");
            }
            return emitter;
        }.bind(this);

        function checkOutputPath(outputPath) {
            if (path.extname(outputPath) !== '.mp4') {
                throw new URIError("Output path must have .mp4 extension.");
            }
        };

        return new Overloader()
            .overload([{ type: Types.STRING }, { type: Types.BOOLEAN, optional: true }], function (outputPath, returnPromise = false) {
                checkOutputPath(outputPath);
                if (returnPromise) {
                    return new Promise((resolve, reject) => {
                        start()
                            .on("finished", () => {
                                resolve();
                            })
                            .on('error', reject);
                    });
                }
                else {
                    start();
                    return this;
                }
            })
            .overload([{ type: Types.STRING }, { type: Types.FUNCTION }], function (outputPath, callback) {
                checkOutputPath(outputPath);
                callback(start());
            })
            .overloader.apply(this, arguments);
    }
}

//Testing
setTempPath("../temp/");

const Rectangle = require("../shapes/rectangle");
const Animation = require("../animation");
var video = new Video({ size: { width: 400, height: 400 }, fps: 2 })
    .add(new Scene()
        .add(0, 4, new Rectangle(0, 0, 200, 200)
            .fill("blue")
            .animate(0, 4, new Animation({ x: 0, y: 0 }, { x: 200, y: 200 })
                .getCalculator()
            )
        )
    )
    .export("../temp/test.mp4", true);

console.log(video.then(() => {
    console.log("done");
}))