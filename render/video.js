//Render the final video

//Dependencies
//Node.js Modules
const fs = require('fs');
const { EventEmitter } = require('events');
const path = require('path');

//Npm Modules
const ffmpeg = require('fluent-ffmpeg');

//My Modules
const { Overloader, Types, Interface, either, typedFunction, instanceOf } = require("../type");
const { sizeType, regularSizeInterface, shortSizeInterface, sizeInterface } = require("./size");
const Scene = require("./scene");
const typify = require("../properties/typify");

//Dependency stuff
const fsPromises = fs.promises;

//Setup ffmpeg

//Image regex
const imageRegex = /canvideo \d+\.png/i;

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
var globalTempPath;

//Make sure directory exists
function directoryExists(path) {
    return new Promise((resolve, reject) => {
        //Check if directory exists
        if (fs.existsSync(path)) {
            fs.lstat(path, (err, stats) => {
                if (!err) {
                    if (stats.isDirectory()) {
                        resolve(path);
                    }
                    else {
                        reject(`directory: ${path}, is not a directory.`);
                    }
                }
                else {
                    reject(`Error checking if directory exists: ${err}`);
                }
            });
        }
        else {
            reject(`directory: ${path}, does not exist.`);
        }
    });
}

//Set the global tempPath
function setTempPath(path) {
    globalTempPath = directoryExists(path);
}

//Check that ffmpeg path is good
function checkFfmpegPath() {
    return new Promise((resolve, reject) => {
        ffmpeg.getAvailableFormats((err, formats) => {
            if (!err && formats) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}

//Set ffmpeg path
var setFfmpegPath = function (path) {
    ffmpeg.setFfmpegPath(path);
    return checkFfmpegPath()
        .then(good => {
            if (!good) {
                throw new ReferenceError(`ffmpegPath: ${path}, is not a valid ffmpegPath.`);
            }
        });
};

//Export steps enum
const ExportSteps = {
    RENDER_FRAMES: 0,
    GENERATE_VIDEO: 1,
    DELETE_FRAMES: 2,
    FINISHED: 3
};

//Video class
class Video extends EventEmitter {
    constructor() {
        super();
        typify(this, {
            tempPath: {
                type: Types.STRING,
                setter(v, set) {
                    set(directoryExists(v));
                }
            },
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
        this.duration = 0;
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

    setTempPath(path) {
        this.tempPath = path;
        return this;
    }

    export() {
        var start = async function (outputPath, { keepImages }) {
            var tempPathToUse = this.tempPath || globalTempPath;
            if (tempPathToUse) {
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

                var frameCount = Math.ceil(this.duration * this.fps);
                var framesFinished = 0;
                var framesAdded = 0;
                var framesDeleted = 0;
                var stepsFinished = 0;
                var totalSteps = 3;
                var emitter = new EventEmitter()
                    .on("frame_progress", progress => {
                        this.emit("frame_progress", progress, emitter);
                        this.emit("any_progress", progress, ExportSteps.RENDER_FRAMES);
                    })
                    .on("frame_finish", frameNumber => {
                        this.emit("frame_finish", frameNumber, emitter);
                        emitter.emit("frame_progress", {
                            progress: ++framesFinished / frameCount,
                            count: framesFinished,
                            total: frameCount
                        });
                    })
                    .on("frame_delete", frameNumber => {
                        this.emit("frame_delete", frameNumber, emitter);
                    })

                    .on("generate_progress", progress => {
                        this.emit("generate_progress", progress, emitter);
                        this.emit("any_progress", progress, ExportSteps.GENERATE_VIDEO);
                    })
                    .on("generate_part", framesGenerated => {
                        this.emit("generate_part", framesGenerated, emitter);
                        emitter.emit("generate_progress", {
                            progress: (framesAdded += framesGenerated) / frameCount,
                            count: framesAdded,
                            total: frameCount
                        });
                    })

                    .on("delete_progress", progress => {
                        this.emit("delete_progress", progress, emitter);
                        this.emit("any_progress", progress, ExportSteps.DELETE_FRAMES);
                    })
                    .on("delete_finish", frameNumber => {
                        this.emit("delete_finish", frameNumber, emitter);
                        emitter.emit("delete_progress", {
                            progress: ++framesDeleted / frameCount,
                            count: framesDeleted,
                            total: frameCount
                        });
                    })

                    .on("step_progress", progress => {
                        emitter.currentStep++;
                        this.emit("stage_progress", progress, emitter);
                    })
                    .on("step_finish", step => {
                        this.emit("step_finish", step, emitter);
                        emitter.emit("step_progress", {
                            progress: ++stepsFinished / totalSteps,
                            count: stepsFinished,
                            total: totalSteps
                        });
                    })

                    .on("any_progress", (progress, step) => {
                        this.emit("any_progress", progress, step, emitter);
                    })
                    .on("finish", () => {
                        this.emit("finish", emitter);
                    })
                    .on('error', err => {
                        this.emit('error', err, emitter);
                    });
                emitter.totalFrames = frameCount;
                emitter.currentStep = 0;
                emitter.video = this;

                var tempPath;
                async function deleteOld() {
                    var files = await fsPromises.readdir(tempPath);
                    var deletePromises = [];
                    for (var i = 0; i < files.length; i++) {
                        let file = files[i];
                        if (imageRegex.test(file)) {
                            //canvideo <
                            //012345678<
                            let frameNumber = parseInt(file.substring(9, file.indexOf('.')));
                            if (frameNumber >= frameCount) {
                                deletePromises.push(fsPromises.unlink(path.join(tempPath, file))
                                    .then(() => {
                                        emitter.emit("frame_delete", frameNumber);
                                    })
                                );
                            }
                        }
                    }
                    return Promise.all(deletePromises);
                };

                var framePaths = [];
                async function renderNew() {
                    var framePromises = [];
                    for (var i = 0; i < frameCount; i++) {
                        let frame = i;
                        let imagePath = path.join(tempPath, `canvideo ${frame}.png`);
                        framePaths.push(imagePath);
                        framePromises.push(new Promise((resolve, reject) => {
                            uriFromFrameNumber(i)
                                .on('end', () => {
                                    emitter.emit("frame_finish", frame);
                                    resolve();
                                })
                                .on('error', err => {
                                    emitter.emit('error', err);
                                    reject();
                                })
                                .pipe(fs.createWriteStream(imagePath));
                        }));
                    }
                    return await Promise.all(framePromises);
                };

                var generateVideo = function () {
                    return new Promise((resolve, reject) => {
                        ffmpeg()
                            .once('end', () => {
                                resolve();
                            })
                            .on('progress', ({ frames }) => {
                                emitter.emit("generate_part", frames - framesAdded);
                            })
                            .on('error', err => {
                                reject(err);
                            })
                            .input(path.join(tempPath, "canvideo %01d.png"))
                            .inputFPS(this.fps)
                            .save(outputPath)
                            .outputFps(this.fps)
                            .noAudio();
                    });
                }.bind(this);

                function deleteFrames() {
                    if (keepImages) {
                        return false;
                    }
                    else {
                        var deletePromises = [];
                        for (var i = 0; i < framePaths.length; i++) {
                            let frameNumber = i;
                            deletePromises.push(fsPromises.unlink(framePaths[frameNumber])
                                .then(() => {
                                    emitter.emit("delete_finish", frameNumber);
                                })
                            );
                        }
                        return Promise.all(deletePromises);
                    }
                };

                async function startSteps() {
                    //Start steps
                    //Wait for tempPath to be available and check that ffmpegPath is valid
                    await Promise.all([
                        tempPathToUse.then(path => {
                            tempPath = path;
                        }),
                        checkFfmpegPath().then(good => {
                            if (!good) {
                                emitter.emit('error', "Invalid ffmpeg path. Use the setFfmpegPath function to set the path.");
                            }
                        })
                    ]);

                    //Delete old frames and render new ones simultaneously
                    await Promise.all([deleteOld(), renderNew()]);
                    emitter.emit("step_finish", ExportSteps.RENDER_FRAMES);

                    //Actually generate video
                    await generateVideo();
                    emitter.emit("step_finish", ExportSteps.GENERATE_VIDEO);

                    //Delete frames
                    await deleteFrames();
                    emitter.emit("step_finish", ExportSteps.DELETE_FRAMES);

                    //And then we're done
                    emitter.emit("finish");
                };

                //Start steps asynchronously and synchronously return emitter
                startSteps();
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

        var handleReturning = function (outputPath, options, returnPromise) {
            checkOutputPath(outputPath);
            if (returnPromise) {
                return new Promise((resolve, reject) => {
                    start(outputPath, options)
                        .on("finished", () => {
                            resolve();
                        })
                        .on('error', reject);
                });
            }
            else {
                start(outputPath, options);
                return this;
            }
        }.bind(this);

        var handleCallback = function(outputPath, options, callback) {
            checkOutputPath(outputPath);
            callback(start(outputPath, options));
            return this;
        }.bind(this);

        return new Overloader()
            .overload([{ type: Types.STRING }, { type: Types.BOOLEAN, optional: true }], function (outputPath, returnPromise = false) {
                return handleReturning(outputPath, { keepImages: false }, returnPromise);
            })
            .overload([{ type: Types.STRING }, { type: exportOptionsInterface }, { type: Types.BOOLEAN, optional: true }], function (outputPath, options, returnPromise = false) {
                return handleReturning(outputPath, options, returnPromise);
            })
            .overload([{ type: Types.STRING }, { type: Types.FUNCTION }], function (outputPath, callback) {
                handleCallback(outputPath, { keepImages: false }, callback);
            })
            .overload([{ type: Types.STRING }, { type: exportOptionsInterface }, { type: Types.FUNCTION }], function (outputPath, options, callback) {
                handleCallback(outputPath, options, callback);
            })
            .overloader.apply(this, arguments);
    }
}

//Export the module
module.exports = { setTempPath, setFfmpegPath, Video, ExportSteps };