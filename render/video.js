//Render the final video

//Dependencies
//Node.js Modules
const fs = require('fs');
const { EventEmitter } = require('events');
const path = require('path');

//Npm Modules
const ffmpeg = require('fluent-ffmpeg');

//My Modules
const { Overloader, Types, Interface, typedFunction, instanceOf } = require("../type");
const { sizeType, regularSizeInterface, shortSizeInterface } = require("./size");
const typify = require("../properties/typify");
const defaultify = require("../lib/default-properties");
const Scene = require("./scene");

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
    .optional("keepImages", Types.BOOLEAN)
    .optional("maxStreams", Types.POSITIVE_INTEGER)
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

    setTempPath(path) {
        this.tempPath = path;
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

    export() {
        var start = function (outputPath, { keepImages, maxStreams }) {
            var tempPathToUse = this.tempPath || globalTempPath;
            if (tempPathToUse) {
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
                    .on("frame_start", frameNumber => {
                        this.emit("frame_start", frameNumber, emitter);
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
                const renderNew = async () => {
                    return new Promise((resolve, reject) => {
                        var sceneStart = 0;
                        var currentScene = 0;
                        var maxAtOnce = Math.min(frameCount, maxStreams);
                        var nextInLine = 0;
                        var framesLeft = frameCount;
                        const doneSavingFrame = () => {
                            if (--framesLeft === 0) {
                                resolve();
                            }
                            else if (nextInLine < frameCount) {
                                saveFrame();
                            }
                        }
                        const saveFrame = () => {
                            let frame = nextInLine;
                            let imagePath = path.join(tempPath, `canvideo ${frame}.png`);
                            framePaths.push(imagePath);
                            emitter.emit("frame_start", frame);
                            var timeInScene = frame * this.spf - sceneStart;
                            var pngStream = this.scenes[currentScene].render(timeInScene, { width: this.width, height: this.height });
                            pngStream
                                .on('end', () => {
                                    pngStream.destroy();
                                    emitter.emit("frame_finish", frame);
                                    doneSavingFrame();
                                })
                                .on('error', err => {
                                    emitter.emit('error', err);
                                    reject(err);
                                })
                                .pipe(fs.createWriteStream(imagePath, { autoClose: true }));


                            let nextTime = ++nextInLine * this.spf;
                            let currentSceneDuration = this.scenes[currentScene].duration;
                            if (nextTime >= sceneStart + currentSceneDuration) {
                                sceneStart += currentSceneDuration;
                                currentScene++;
                            }
                        }
                        for (var i = 0; i < maxAtOnce; i++) {
                            saveFrame();
                        }
                    });
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
                            .input(path.join(__dirname, "../generated/test.srt"))
                            .save(outputPath)
                            .outputFps(this.fps)
                            .videoCodec('libx264')
                            .withOption([
                                '-threads 1',
                                '-pix_fmt yuv420p',
                                '-movflags faststart'
                            ])
                            .noAudio();
                    });
                }.bind(this);

                async function deleteFrames() {
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

        const defaultOptions = {
            keepImages: false,
            maxStreams: 100
        }
        var handleReturning = function (outputPath, options, returnPromise) {
            options = defaultify(options, defaultOptions);
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

        var handleCallback = function (outputPath, options, callback) {
            options = defaultify(options, defaultOptions);
            checkOutputPath(outputPath);
            callback(start(outputPath, options));
            return this;
        }.bind(this);

        if (this.duration > 0) {
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
        else {
            throw new Error("video duration must be greater than 0.");
        }
    }
}

//Export the module
module.exports = { setTempPath, setFfmpegPath, Video, ExportSteps };