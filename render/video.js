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

//Setup ffmpeg
//TODO let the user choose the ffmpeg path.
ffmpeg.setFfmpegPath("ffmpeg");

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

//Export options interface
const exportOptionsInterface = new Interface(false)
    .required("keepImages", Types.BOOLEAN)
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

    static Stages = {
        RENDER_FRAMES: 0,
        GENERATE_VIDEO: 1,
        DELETE_FRAMES: 2,
        FINISHED: 3
    };
    export() {
        var start = function (outputPath, keepImages) {
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
                var framesFinished = 0;
                var framesAdded = 0;
                var framesDeleted = 0;
                var stagesFinished = 0;
                var totalStages = 3;
                var emitter = new EventEmitter()
                    .on("frame_progress", progress => {
                        this.emit("frame_progress", progress, emitter);
                        this.emit("any_progress", progress, Video.Stages.RENDER_FRAMES);
                    })
                    .on("frame_finish", frameNumber => {
                        this.emit("frame_finish", frameNumber, emitter);
                        emitter.emit("frame_progress", {
                            progress: ++framesFinished / numberOfFrames,
                            count: framesFinished,
                            total: numberOfFrames
                        });
                    })

                    .on("generate_progress", progress => {
                        this.emit("generate_progress", progress, emitter);
                        this.emit("any_progress", progress, Video.Stages.GENERATE_VIDEO);
                    })
                    .on("generate_part", frames => {
                        this.emit("generate_part", frames, emitter);
                        emitter.emit("generate_progress", {
                            progress: (framesAdded += frames) / numberOfFrames,
                            count: framesAdded,
                            total: numberOfFrames
                        });
                    })

                    .on("delete_progress", progress => {
                        this.emit("delete_progress", progress, emitter);
                        this.emit("any_progress", progress, Video.Stages.DELETE_FRAMES);
                    })
                    .on("delete_finish", frameNumber => {
                        this.emit("delete_finish", frameNumber, emitter);
                        emitter.emit("delete_progress", {
                            progress: ++framesDeleted / numberOfFrames,
                            count: framesDeleted,
                            total: numberOfFrames
                        });
                    })

                    .on("stage_progress", progress => {
                        emitter.currentStage++;
                        this.emit("stage_progress", progress, emitter);
                    })
                    .on("stage_finish", stage => {
                        this.emit("stage_finish", stage, emitter);
                        emitter.emit("stage_progress", ++stagesFinished / totalStages);
                    })

                    .on("any_progress", (progress, stage) => {
                        this.emit("any_progress", progress, stage, emitter);
                    })
                    .on("finish", () => {
                        this.emit("finish", emitter);
                    })
                    .on('error', err => {
                        this.emit('error', err, emitter);
                    });
                emitter.totalFrames = numberOfFrames;
                emitter.currentStage = 0;
                emitter.video = this;
                this.tempPath.then(tempPath => {
                    var framePaths = [];

                    function deleteFrames() {
                        var deletePromises = [];
                        for (var i = 0; i < framePaths.length; i++) {
                            let frameNumber = i;
                            deletePromises.push(new Promise((resolve, reject) => {
                                fs.unlink(framePaths[i], () => {
                                    emitter.emit("delete_finish", frameNumber);
                                    resolve();
                                });
                            }));
                        }
                        return Promise.all(deletePromises);
                    }

                    var framePromises = [];
                    for (var i = 0; i < numberOfFrames; i++) {
                        var framePath = path.join(tempPath, `/${i}.png`);
                        framePaths.push(framePath);

                        let frameNumber = i;

                        let frameStream = uriFromFrameNumber(i);
                        let outStream = fs.createWriteStream(framePath, { encoding: "base64" });
                        framePromises.push(new Promise((resolve, reject) => {
                            frameStream
                                .on('end', () => {
                                    emitter.emit("frame_finish", frameNumber);
                                    resolve();
                                })
                                .on('error', err => {
                                    emitter.emit('error', err, frameNumber);
                                })
                                .pipe(outStream);
                        }));
                    }
                    Promise.all(framePromises)
                        .then(() => {
                            //First step done
                            emitter.emit("stage_finish", Video.Stages.RENDER_FRAMES);

                            //Generate video using ffmpeg
                            ffmpeg()
                                .input(path.join(tempPath, "/%01d.png"))
                                .inputFPS(this.fps)
                                .on('progress', progress => {
                                    emitter.emit("generate_part", progress.frames - framesAdded);
                                })
                                .on('end', async () => {
                                    //Done with second stage
                                    emitter.emit("stage_finish", Video.Stages.GENERATE_VIDEO);

                                    //Delete frames
                                    if (!keepImages) {
                                        await deleteFrames();
                                    }
                                    emitter.emit("stage_finish", Video.Stages.DELETE_FRAMES);
                                    emitter.emit("finish");
                                })
                                .save(outputPath)
                                .noAudio();
                        })
                        .catch(err => undefined);
                });
                return emitter;
            }
            else {
                throw new ReferenceError("tempPath must be set before exporting.");
            }
        }.bind(this);

        function checkOutputPath(outputPath) {
            if (path.extname(outputPath) !== '.mp4') {
                throw new URIError("Output path must have .mp4 extension.");
            }
        };

        var handleReturning = function (outputPath, keepImages, returnPromise) {
            checkOutputPath(outputPath);
            if (returnPromise) {
                return new Promise((resolve, reject) => {
                    start(outputPath, keepImages)
                        .on("finished", () => {
                            resolve();
                        })
                        .on('error', reject);
                });
            }
            else {
                start(outputPath, keepImages);
                return this;
            }
        }.bind(this);

        function handleCallback(outputPath, keepImages, callback) {
            checkOutputPath(outputPath);
            callback(start(outputPath, keepImages));
        }

        return new Overloader()
            .overload([{ type: Types.STRING }, { type: Types.BOOLEAN, optional: true }], function (outputPath, returnPromise = false) {
                return handleReturning(outputPath, false, returnPromise);
            })
            .overload([{ type: Types.STRING }, { type: exportOptionsInterface }, { type: Types.BOOLEAN, optional: true }], function (outputPath, { keepImages }, returnPromise = false) {
                return handleReturning(outputPath, keepImages, returnPromise);
            })
            .overload([{ type: Types.STRING }, { type: Types.FUNCTION }], function (outputPath, callback) {
                handleCallback(outputPath, false, callback);
            })
            .overload([{ type: Types.STRING }, { type: exportOptionsInterface }, { type: Types.FUNCTION }], function (outputPath, { keepImages }, callback) {
                handleCallback(outputPath, keepImages, callback);
            })
            .overloader.apply(this, arguments);
    }
}

//Testing
setTempPath("../temp/");

const Rectangle = require("../shapes/rectangle");
const Animation = require("../animation");
var video = new Video({ size: { width: 400, height: 400 }, fps: 60 })
    .add(new Scene()
        .add(0, 4, new Rectangle(0, 0, 200, 200)
            .fill("blue")
            .animate(0, 4, new Animation({ x: 0, y: 0 }, { x: 200, y: 200 })
                .getCalculator()
            )
        )
    )
    .add(new Scene()
        .add(1, 3, new Rectangle(200, 200, 0, 0)
            .fill("green")
            .animate(1, 3, new Animation({ x: 200, y: 200, width: 0, height: 0 }, { x: 0, y: 0, width: 400, height: 400 })
                .getCalculator()
            )
        )
    )
    .export("../temp/test.mp4");

video.on("finish", () => {
    console.log("done")
})