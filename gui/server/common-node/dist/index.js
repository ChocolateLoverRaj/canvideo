"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generate_mp4_1 = __importDefault(require("canvideo/dist/generate-mp4"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const getState_1 = __importDefault(require("./getState"));
const fs_1 = require("fs");
class Generator {
    constructor(generatedDir) {
        this.videos = new Map();
        this.latestId = 0;
        this.generatedDir = generatedDir;
        this.outputDir = path_1.join(generatedDir, 'output');
        this.tempDir = path_1.join(generatedDir, 'temp');
        this.ready = fs_extra_1.ensureDir(generatedDir).then(async () => await Promise.all([
            fs_extra_1.emptyDir(this.outputDir),
            fs_extra_1.emptyDir(this.tempDir)
        ]));
    }
    getVideoPath(id) {
        return path_1.join(this.outputDir, `${id}.mp4`);
    }
    generate(operations, options) {
        const id = this.latestId++;
        const outputFile = this.getVideoPath(id);
        this.videos.set(id, getState_1.default(this.ready.then(() => generate_mp4_1.default(operations, Object.assign(Object.assign({}, options), { outputFile: outputFile, tempDir: this.tempDir, prefix: id })))
            .then(async () => await fs_1.promises.stat(outputFile))
            .then(({ size }) => size)));
        return id;
    }
}
exports.default = Generator;
