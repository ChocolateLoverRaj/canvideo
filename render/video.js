//Render the final video

//Dependencies
//Node.js Modules
const fs = require('fs');
const { EventEmitter } = require('events');
const path = require('path');
const { exec } = require('child_process');

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
var tempPath;
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
    tempPath = directoryExists(path);
}

//Check that ffmpeg path is good
async function checkFfmpegPath() {
    return new Promise((resolve, reject) => {
        var command = exec(`${ffmpegPath} -version`);
        command.once("exit", code => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(`Check command failed: ${ffmpegPath} -version.`);
            }
        });
    });
};

//Set ffmpeg path
var ffmpegPath = "ffmpeg";
var setFfmpegPath = function (path) {
    ffmpegPath = path;
};

//Export enums
//The export process is split into stages.
//Each stage has some tasks that it depends on.
//After those tasks are done, it starts the tasks that depend on the stage to be done.

//Visualization

// START                 CREATE_FILES                     GENERATE_VIDEO       DELETE_FRAMES       FINISH
// | --> CHECK_TEMP_PATH |                                |                    |                   |
//                       | --> DELETE_EXTRA_FRAMES        |                    |                   |
//                       | --> RENDER_NEW_FRAMES          |                    |                   |
//                       | --> GENERATE_EMBEDDED_CAPTIONS |                    |                   |
//                       |                                | --> GENERATE_VIDEO |                   |
//                       |                                                     | --> DELETE_FRAMES |
//                       | --> GENERATE_SEPARATE_CAPTIONS                                          |

//Export stages enum
const ExportStages = {
    START: "START",
    CREATE_FILES: "CREATE_FILES",
    GENERATE_VIDEO: "GENERATE_VIDEO",
    DELETE_FRAMES: "DELETE_FRAMES",
    FINISH: "FINISH"
};

//Export tasks enum
const ExportTasks = {
    CHECK_TEMP_PATH: {
        name: "CHECK_TEMP_PATH",
        start: ExportStages.START,
        end: ExportStages.CREATE_FILES
    },
    DELETE_EXTRA_FRAMES: {
        name: "DELETE_EXTRA_FRAMES",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.GENERATE_VIDEO
    },
    RENDER_NEW_FRAMES: {
        name: "RENDER_NEW_FRAMES",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.GENERATE_VIDEO
    },
    GENERATE_SEPARATE_CAPTIONS: {
        name: "GENERATE_SEPARATE_CAPTIONS",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.FINISH
    },
    GENERATE_EMBEDDED_CAPTIONS: {
        name: "GENERATE_EMBEDDED_CAPTIONS",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.GENERATE_VIDEO
    },
    GENERATE_VIDEO: {
        name: "GENERATE_VIDEO",
        start: ExportStages.GENERATE_VIDEO,
        end: ExportStages.DELETE_FRAMES
    },
    DELETE_FRAMES: {
        name: "DELETE_FRAMES",
        start: ExportStages.DELETE_FRAMES,
        end: ExportStages.FINISH
    }
}

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
        const start = (outputPath, { keepImages, maxStreams }) => {
            var tempPathToUse = this.tempPath || tempPath;
            if (tempPathToUse) {
                var frameCount = Math.ceil(this.duration * this.fps);

                var emitter = new EventEmitter();
                emitter.checkTempPath = new EventEmitter();
                emitter.deleteExtraFrames = new EventEmitter();

                emitter.totalFrames = frameCount;
                emitter.currentStep = 0;
                emitter.video = this;

                const checkTempPath = async () => {
                    emitter.checkTempPath.emit("start");
                    emitter.emit("checkTempPath_start");
                    this.emit("checkTempPath_start", emitter);

                    tempPathToUse = await tempPathToUse;

                    emitter.checkTempPath.emit("finish");
                    emitter.emit("checkTempPath_finish");
                    this.emit("checkTempPath_finish", emitter);
                }

                const deleteExtraFrames = async () => {
                    emitter.deleteExtraFrames.emit("start");
                    emitter.emit("deleteExtraFrames_start");
                    this.emit("deleteExtraFrames_start");

                    var files = await fsPromises.readdir(tempPathToUse);
                    emitter.deleteExtraFrames.emit("readDir");
                    emitter.emit("deleteExtraFrames_readDir");
                    this.emit("deleteExtraFrames_readDir");

                    var deletePromises = [];
                    for (var i = 0; i < files.length; i++) {
                        let file = files[i];
                        if (imageRegex.test(file)) {
                            //canvideo <
                            //012345678<
                            let frameNumber = parseInt(file.substring(9, file.indexOf('.')));
                            if (frameNumber >= frameCount) {
                                emitter.deleteExtraFrames.emit("deleteStart", frameNumber);
                                emitter.emit("deleteExtraFrames_deleteStart", frameNumber);
                                this.emit("deleteExtraFrames_deleteStart", frameNumber);

                                deletePromises.push(fsPromises.unlink(path.join(tempPathToUse, file))
                                    .then(() => {
                                        emitter.deleteExtraFrames.emit("deleteFinish", frameNumber);
                                        emitter.emit("deleteExtraFrames_deleteFinish", frameNumber);
                                        this.emit("deleteExtraFrames_deleteFinish", frameNumber);
                                    })
                                );
                            }
                        }
                    }
                    return Promise.all(deletePromises).then(() => {
                        emitter.deleteExtraFrames.emit("finish");
                        emitter.emit("deleteExtraFrames_finish");
                        this.emit("deleteExtraFrames_finish");
                    });
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

                const generateVideo = async () => {
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
                            .videoCodec('libx264')
                            .withOption([
                                '-threads 1',
                                '-pix_fmt yuv420p',
                                '-movflags faststart'
                            ])
                            .noAudio();
                    });
                };

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

                const startStages = async () => {
                    //START
                    emitter.emit("stage", ExportStages.START);
                    this.emit("stage", ExportStages.START, emitter);
                    //CHECK_TEMP_PATH
                    emitter.emit("taskStart", ExportTasks.CHECK_TEMP_PATH);
                    this.emit("taskStart", ExportTasks.CHECK_TEMP_PATH, emitter);
                    await checkTempPath();
                    emitter.emit("taskFinish", ExportTasks.CHECK_TEMP_PATH);
                    this.emit("taskFinish", ExportTasks.CHECK_TEMP_PATH, emitter);

                    //CREATE_FILES
                    var generateVideo = [];
                    emitter.emit("stage", ExportStages.CREATE_FILES);
                    this.emit("stage", ExportStages.CREATE_FILES, emitter);
                    //DELETE_EXTRA_FRAMES
                    emitter.emit("taskStart", ExportTasks.DELETE_EXTRA_FRAMES);
                    this.emit("taskStart", ExportTasks.DELETE_EXTRA_FRAMES, emitter);
                    generateVideo.push(deleteExtraFrames().then(() => {
                        emitter.emit("taskFinish", ExportTasks.DELETE_EXTRA_FRAMES);
                        this.emit("taskFinish", ExportTasks.DELETE_EXTRA_FRAMES, emitter);
                    }));
                    await Promise.all(generateVideo);

                    //GENERATE_VIDEO
                    emitter.emit("stage", ExportStages.GENERATE_VIDEO);
                    this.emit("stage", ExportStages.GENERATE_VIDEO, emitter);
                };

                //Start steps and synchronously return emitter
                setImmediate(startStages);
                return emitter;
            }
            else {
                throw new ReferenceError("tempPath must be set before exporting.");
            }
        };

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
                    return handleCallback(outputPath, { keepImages: false }, callback);
                })
                .overload([{ type: Types.STRING }, { type: exportOptionsInterface }, { type: Types.FUNCTION }], function (outputPath, options, callback) {
                    return handleCallback(outputPath, options, callback);
                })
                .overloader.apply(this, arguments);
        }
        else {
            throw new Error("video duration must be greater than 0.");
        }
    }
}

//Export the module
module.exports = {
    tempPath, setTempPath,
    ffmpegPath, setFfmpegPath, checkFfmpegPath,
    ExportStages, ExportTasks,
    Video
};