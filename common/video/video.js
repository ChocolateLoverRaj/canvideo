//Render the final video

//Dependencies

import CommonVideo from "./common-video.js";

//Node.js Modules
import fs, { promises as fsPromises } from 'fs';
import { EventEmitter, once } from 'events';
import path from 'path';
import { exec } from 'child_process';

//My Modules
import Overloader from "../type/overloader.js";
import Types from "../type/types.js";
import { Interface } from "../type/interface.js";
import typedFunction from "../type/typed-function.js";
import instanceOf from "../type/instanceOf.js";
import either from "../type/either.js";
import { sizeType, regularSizeInterface, shortSizeInterface } from "./size.js";
import typify from "../properties/typify.js";
import defaultify from "../lib/defaultify.js";
import Scene from "../scene/scene.js";
import { ExportStages, ExportTasks } from "./stages.js";

//Image regex
const imageRegex = /canvideo \d+\.png/i;

//Temp path
export var tempPath;
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
export const setTempPath = (path) => tempPath = directoryExists(path);

//Check that ffmpeg path is good
var ffmpegPathStatus;
export const checkFfmpegPath = async () => new Promise((resolve, reject) => {
    var command = exec(`${ffmpegPath} -version`);
    command.once("exit", code => {
        if (code === 0) {
            ffmpegPathStatus = true;
            resolve();
        }
        else {
            ffmpegPathStatus = false;
            reject(`Check command failed: ${ffmpegPath} -version.`);
        }
    });
});

//Set and get ffmpeg path
var ffmpegPath = "ffmpeg";
export const setFfmpegPath = (path) => {
    if (path !== ffmpegPath) {
        ffmpegPath = path;
        ffmpegPathStatus = undefined;
    }
};
export const getFfmpegPath = () => ffmpegPath;

//Output interface
const outputInterface = new Interface(false)
    .required("video", Types.STRING)
    .optional("captions", either(Types.STRING, instanceOf(Map)))
    .optional("embeddedCaptions", either(Types.BOOLEAN, instanceOf(Set)))
    .toType();

//Output type
const outputType = either(Types.STRING, outputInterface);

//Video class
export class Video extends CommonVideo {
    setTempPath(path) {
        this.tempPath = path;
        return this;
    }

    export() {
        if (this.duration === 0) {
            throw new Error("video duration must be greater than 0.");
        }

        const start = (output, { keepImages, maxStreams }) => {
            var outputVideo, outputCaptions, embeddedCaptions;
            if (typeof output === 'string') {
                outputVideo = output;
                outputCaptions = new Map();
                embeddedCaptions = new Set();
            }
            else {
                outputVideo = output.video;
                outputCaptions = output.captions || new Map();
                if (typeof outputCaptions === 'string') {
                    let outputCaptionsDir = outputCaptions;
                    outputCaptions = new Map();
                    for (let { captions } of this.scenes) {
                        for (let id of captions.keys()) {
                            if (!outputCaptions.has(id)) {
                                outputCaptions.set(id, path.resolve(path.join(outputCaptionsDir, id + ".vtt")));
                            }
                        }
                    }
                }
                embeddedCaptions = output.embeddedCaptions || false;
            }

            var tempPathToUse = this.tempPath || tempPath;
            if (!tempPathToUse) {
                throw new ReferenceError("tempPath must be set before exporting.");
            }

            var frameCount = Math.ceil(this.duration * this.fps);

            var emitter = new EventEmitter();

            emitter.currentStage = ExportStages.START;
            emitter.currentTasks = new Set();

            emitter.checkTempPath = new EventEmitter();
            emitter.deleteExtraFrames = new EventEmitter();
            emitter.renderNewFrames = new EventEmitter();
            emitter.generateEmbeddedCaptions = new EventEmitter();
            emitter.generateVideo = new EventEmitter();
            emitter.deleteFrames = new EventEmitter();
            emitter.deleteCaptions = new EventEmitter();
            emitter.generateSeparateCaptions = new EventEmitter();

            emitter.totalFrames = frameCount;
            emitter.video = this;

            const getTaskEmitter = task => {
                if (emitter.hasOwnProperty(task)) {
                    let taskEmitter = emitter[task];
                    return (name, ...params) => {
                        taskEmitter.emit(name);
                        emitter.emit(`${task}_${name}`, ...params);
                        this.emit(`${task}_${name}`, ...params, emitter);
                    };
                }
                else {
                    throw new ReferenceError(`emitter doesn't have task: ${task}.`);
                }
            };

            const checkTempPath = async () => {
                let emit = getTaskEmitter("checkTempPath");
                emit("start");
                tempPathToUse = await tempPathToUse;
                emit("finish");
            }

            const deleteExtraFrames = async () => {
                let emit = getTaskEmitter("deleteExtraFrames");
                emit("start");

                var files = await fsPromises.readdir(tempPathToUse);
                emit("readDir");

                var deletePromises = [];
                for (var i = 0; i < files.length; i++) {
                    let file = files[i];
                    if (imageRegex.test(file)) {
                        //canvideo <
                        //012345678<
                        let frameNumber = parseInt(file.substring(9, file.indexOf('.')));
                        if (frameNumber >= frameCount) {
                            emit("deleteStart", frameNumber);
                            deletePromises.push(fsPromises.unlink(path.join(tempPathToUse, file))
                                .then(() => {
                                    emit("deleteFinish", frameNumber);
                                })
                            );
                        }
                    }
                }
                return Promise.all(deletePromises).then(() => {
                    emit("finish");
                });
            };

            const embeddedCaptionsWrites = new Map();
            const embeddedCaptionFiles = new Set();
            const tempCaptionFiles = new Map();
            const generateEmbeddedCaptions = async () => {
                let emit = getTaskEmitter("generateEmbeddedCaptions");
                emit("start");
                if (embeddedCaptions) {
                    let captionsStrings = new Map();
                    let currentTime = 0;
                    for (let { captions, duration } of this.scenes) {
                        for (let [id, caption] of captions) {
                            if (embeddedCaptions === true || embeddedCaptions.has(id)) {
                                if (captionsStrings.has(id)) {
                                    captionsStrings.set(id, captionsStrings.get(id) + caption.toVtt(false, currentTime));
                                }
                                else {
                                    captionsStrings.set(id, caption.toVtt(true, currentTime));
                                }
                            }
                        }
                        currentTime += duration;
                    };
                    //Check that there are no caption ids that don't exist
                    if (typeof embeddedCaptions === 'object') {
                        for (let id of embeddedCaptions.keys()) {
                            if (!captionsStrings.has(id)) {
                                throw new ReferenceError(`No captions with id: ${id}, found.`);
                            }
                        }
                    }
                    let writePromises = [];
                    for (let [id, captionString] of captionsStrings) {
                        let captionOutput;
                        if (outputCaptions.has(id)) {
                            captionOutput = outputCaptions.get(id);
                        }
                        else {
                            captionOutput = path.resolve(path.join(tempPathToUse, `./canvideo ${id}.vtt`));
                            tempCaptionFiles.set(id, captionOutput);
                        }
                        emit("writeStart", id);
                        var captionsWrite = fsPromises.writeFile(captionOutput, captionString).then(() => {
                            emit("writeFinish", id);
                        });
                        embeddedCaptionsWrites.set(id, captionsWrite);
                        writePromises.push(captionsWrite);
                        embeddedCaptionFiles.add(captionOutput);
                    }
                    await Promise.all(writePromises);
                }
                emit("finish");
            };

            const generateSeparateCaptions = async () => {
                let emit = getTaskEmitter("generateSeparateCaptions");
                emit("start");
                let writePromises = [];
                let captionsToWrite = new Map();
                for (let [id, captionsPath] of outputCaptions) {
                    if (path.extname(captionsPath) !== ".vtt") {
                        throw new URIError("Unrecognized caption file format. Currently, only .vtt is supported.");
                    }
                    if (embeddedCaptionsWrites.has(id)) {
                        writePromises.push(embeddedCaptionsWrites.get(id));
                    }
                    else {
                        captionsToWrite.set(id, captionsPath);
                    }
                };
                let captionsStrings = new Map();
                let currentTime = 0;
                for (let { captions, duration } of this.scenes) {
                    for (let [id, caption] of captions) {
                        if (captionsToWrite.has(id)) {
                            if (captionsStrings.has(id)) {
                                captionsStrings.set(id, captionsStrings.get(id) + caption.toVtt(false, currentTime));
                            }
                            else {
                                captionsStrings.set(id, caption.toVtt(true, currentTime));
                            }
                        }
                    }
                    currentTime += duration;
                };
                for (let [id, captionString] of captionsStrings) {
                    let captionOutput = captionsToWrite.get(id);
                    var captionsWrite = fsPromises.writeFile(captionOutput, captionString).then(() => {
                        emit("writeFinish", id);
                    });
                    emit("writeStart", id);
                    writePromises.push(captionsWrite);
                }
                await Promise.all(writePromises);
                emit("finish");
            };

            var framePaths = [];
            const renderNewFrames = async () => {
                let emit = getTaskEmitter("renderNewFrames");
                emit("start");

                let writePromises = 0;
                let f = 0;
                let writeEmitter = new EventEmitter();
                let startedAll = false;

                const addWrite = (write) => {
                    writePromises++;
                    write.then(() => {
                        if (--writePromises < maxStreams) {
                            writeEmitter.emit("ready");
                            if (startedAll && writePromises === 0) {
                                writeEmitter.emit("done");
                            }
                        }
                    });
                }

                const nextTurn = async () => {
                    if (writePromises < maxStreams) {
                        return Promise.resolve();
                    }
                    else {
                        return once(writeEmitter, "ready");
                    }
                };

                for (let scene of this.scenes) {
                    for (let sceneFrame = 0; sceneFrame < scene.duration * this.fps; sceneFrame++) {
                        let currentFrame = f;

                        await nextTurn();

                        emit("renderStart", currentFrame);
                        let canvas = scene.render(sceneFrame / this.fps, this);
                        addWrite(new Promise((resolve, reject) => {
                            let framePath = path.join(tempPathToUse, `./canvideo ${currentFrame}.png`);
                            framePaths.push(framePath);

                            canvas.createPNGStream()
                                .once('end', resolve)
                                .pipe(fs.createWriteStream(framePath))
                        }).then(() => {
                            emit("renderFinish", currentFrame);
                        }));
                        f++;
                    }
                }
                startedAll = true;

                await once(writeEmitter, "done");
                emit("finish");
            };

            const generateVideo = async () => {
                let emit = getTaskEmitter("generateVideo");
                emit("start");
                emit("checkFfmpegPathStart");
                if (ffmpegPathStatus === false) {
                    throw new ReferenceError("Bad ffmpeg path.");
                }
                else if (ffmpegPathStatus === undefined) {
                    await checkFfmpegPath().catch(() => {
                        throw new ReferenceError("Bad ffmpeg path.");
                    });
                }
                emit("checkFfmpegPathFinish");
                emit("generateStart");
                //Check that outputVideo is .mp4
                checkVideoPath(outputVideo);
                //Command to generate video
                let ffmpegCommand = `${ffmpegPath}`;
                //Add fps
                ffmpegCommand += ` -r ${this.fps}`;
                //Add frame input.
                ffmpegCommand += ` -i "${path.join(tempPathToUse, "./canvideo %01d.png")}"`;
                //Add captions.
                for (let captionFile of embeddedCaptionFiles) {
                    ffmpegCommand += ` -i "${captionFile}"`;
                }
                //Add mappings
                ffmpegCommand += " -map 0:v";
                for (var i = 1; i <= embeddedCaptionFiles.size; i++) {
                    ffmpegCommand += ` -map ${i}:s`;
                }
                //Add more options
                ffmpegCommand += " -c:s mov_text -an -vcodec libx264 -pix_fmt yuv420p -progress pipe:1 -y";
                //Add output path
                ffmpegCommand += ` "${outputVideo}"`;
                //Await a promise because of special async logic.
                await new Promise((resolve, reject) => {
                    let command = exec(ffmpegCommand);
                    command.stdout.on('data', data => {
                        //This is the progress chunk
                        //Get the frame, total_size, and progress
                        let frames = parseInt(/(?<=frame=)\S.*/.exec(data)[0]);
                        let size = parseInt(/(?<=total_size=)\S.*/.exec(data)[0]);
                        let finished = /(?<=progress=)\S.*/.exec(data)[0] === 'end' ? true : false;
                        emit("generateProgress", {
                            frames,
                            totalFrames: frameCount,
                            size,
                            progress: frames / frameCount,
                            finished
                        });
                    });
                    command.once('exit', code => {
                        if (code === 0) {
                            emit("generateFinish");
                            resolve();
                        }
                        else {
                            reject("ffmpeg process exited with non 0 code.");
                        }
                    });
                });
                emit("finish");
            };

            const deleteFrames = async () => {
                let emit = getTaskEmitter("deleteFrames");
                emit("start");
                if (!keepImages) {
                    var deletePromises = [];
                    for (var i = 0; i < framePaths.length; i++) {
                        let frameNumber = i;
                        emit("deleteStart", frameNumber);
                        deletePromises.push(fsPromises.unlink(framePaths[frameNumber])
                            .then(() => {
                                emit("deleteFinish", frameNumber);
                            })
                        );
                    }
                    await Promise.all(deletePromises);
                }
                emit("finish");
            };

            const deleteCaptions = async () => {
                let emit = getTaskEmitter("deleteCaptions");
                emit("start");
                let deletePromises = [];
                for (let [id, tempCaptionFile] of tempCaptionFiles) {
                    emit("deleteStart", id);
                    deletePromises.push(fsPromises.unlink(tempCaptionFile).then(() => {
                        emit("deleteFinish", id);
                    }));
                }
                await Promise.all(deletePromises);
                emit("finish");
            };

            const emit = (name, ...params) => {
                emitter.emit(name, ...params);
                this.emit(name, ...params, emitter);
            }

            const stage = stage => {
                emitter.currentStage = stage;
                emit("stage", stage);
            };

            const taskStart = task => {
                emitter.currentTasks.add(task);
                emit("taskStart", task);
            }

            const taskFinish = task => {
                emitter.currentTasks.delete(task);
                emit("taskFinish", task);
            }

            const startStages = async () => {
                //START
                stage(ExportStages.START);
                //CHECK_TEMP_PATH
                taskStart(ExportTasks.CHECK_TEMP_PATH);
                await checkTempPath();
                taskFinish(ExportTasks.CHECK_TEMP_PATH);

                //CREATE_FILES
                let generateVideoPromises = [];
                let finishPromises = [];
                stage(ExportStages.CREATE_FILES);
                //DELETE_EXTRA_FRAMES
                taskStart(ExportTasks.DELETE_EXTRA_FRAMES);
                generateVideoPromises.push(deleteExtraFrames().then(() => {
                    taskFinish(ExportTasks.DELETE_EXTRA_FRAMES);
                }));
                //RENDER_NEW_FRAMES
                taskStart(ExportTasks.RENDER_NEW_FRAMES);
                generateVideoPromises.push(renderNewFrames().then(() => {
                    taskFinish(ExportTasks.RENDER_NEW_FRAMES);
                }));
                //GENERATE_EMBEDDED_CAPTIONS
                taskStart(ExportTasks.GENERATE_EMBEDDED_CAPTIONS);
                generateVideoPromises.push(generateEmbeddedCaptions().then(() => {
                    taskFinish(ExportTasks.GENERATE_EMBEDDED_CAPTIONS);
                }));
                //GENERATE_SEPARATE_CAPTIONS
                taskStart(ExportTasks.GENERATE_SEPARATE_CAPTIONS);
                finishPromises.push(generateSeparateCaptions().then(() => {
                    taskFinish(ExportTasks.GENERATE_SEPARATE_CAPTIONS);
                }));
                await Promise.all(generateVideoPromises);

                //GENERATE_VIDEO
                stage(ExportStages.GENERATE_VIDEO);
                //GENERATE_VIDEO
                taskStart(ExportTasks.GENERATE_VIDEO);
                await generateVideo();
                taskFinish(ExportTasks.GENERATE_VIDEO);

                //DELETE_TEMPORARY
                stage(ExportStages.DELETE_TEMPORARY);
                //DELETE_FRAMES
                taskStart(ExportTasks.DELETE_FRAMES);
                finishPromises.push(deleteFrames().then(() => {
                    taskFinish(ExportTasks.DELETE_FRAMES);
                }));
                //DELETE_CAPTIONS
                taskStart(ExportTasks.DELETE_CAPTIONS);
                finishPromises.push(deleteCaptions().then(() => {
                    taskFinish(ExportTasks.DELETE_CAPTIONS);
                }));
                await Promise.all(finishPromises);

                //FINISH
                stage(ExportStages.FINISH);
            };

            //Start steps and synchronously return emitter
            setImmediate(() => {
                emit("start");
                startStages()
                    .then(() => {
                        emit("finish");
                    })
                    .catch(err => {
                        emit('error', err);
                    });
            });
            return emitter;
        };

        function checkVideoPath(outputPath) {
            if (path.extname(outputPath) !== '.mp4') {
                throw new URIError("Output path must have .mp4 extension.");
            }
        };

        const defaultOptions = {
            keepImages: false,
            maxStreams: 100
        }
        const handleReturning = (outputPath, options, returnPromise) => {
            options = defaultify(options, defaultOptions);
            if (returnPromise) {
                return new Promise((resolve, reject) => {
                    start(outputPath, options)
                        .on("finish", () => {
                            resolve();
                        })
                        .on('error', reject);
                });
            }
            else {
                start(outputPath, options);
                return this;
            }
        };

        const handleCallback = (outputPath, options, callback) => {
            options = defaultify(options, defaultOptions);
            callback(start(outputPath, options));
            return this;
        };

        return new Overloader()
            .overload([{ type: outputType }, { type: Types.BOOLEAN, optional: true }], function (outputPath, returnPromise = false) {
                return handleReturning(outputPath, { keepImages: false }, returnPromise);
            })
            .overload([{ type: outputType }, { type: exportOptionsInterface }, { type: Types.BOOLEAN, optional: true }], function (outputPath, options, returnPromise = false) {
                return handleReturning(outputPath, options, returnPromise);
            })
            .overload([{ type: outputType }, { type: Types.FUNCTION }], function (outputPath, callback) {
                return handleCallback(outputPath, { keepImages: false }, callback);
            })
            .overload([{ type: outputType }, { type: exportOptionsInterface }, { type: Types.FUNCTION }], function (outputPath, options, callback) {
                return handleCallback(outputPath, options, callback);
            })
            .overloader.apply(this, arguments);
    }
}