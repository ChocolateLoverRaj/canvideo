import { EventEmitter } from 'events';

import { SceneJson, Scene } from "./scene";
import csMappings from "../../common/shapes/cs-mappings";
import { caMappings } from '../animations/animanaged';
import { ExportStages } from "./stages";
import ExportTask from "./export-task";

interface Progress {
    progress: number;
    count: number;
    total: number;
}

interface RegularSize {
    width: number;
    height: number;
}
interface ShortSize {
    w: number;
    h: number;
}

interface RegularOptions extends RegularSize {
    fps: number;
}
interface ShortOptions extends ShortSize {
    fps: number;
}

interface RegularSquashedOptions {
    size: RegularSize;
    fps: number;
}
interface ShortSquashedOptions {
    size: ShortSize;
    fps: number;
}

interface ExportOptions {
    keepImages?: boolean;
    maxStreams?: number;
}

namespace VideoExport {
    abstract class CheckTempPath extends EventEmitter {
        addListener(event: "start", listener: () => void): this;
        addListener(event: "finish", listener: () => void): this;

        on(event: "start", listener: () => void): this;
        on(event: "finish", listener: () => void): this;

        once(event: "start", listener: () => void): this;
        once(event: "finish", listener: () => void): this;

        prependListener(event: "start", listener: () => void): this;
        prependListener(event: "finish", listener: () => void): this;

        prependOnceListener(event: "start", listener: () => void): this;
        prependOnceListener(event: "finish", listener: () => void): this;
    }

    abstract class DeleteExtraFrames extends EventEmitter {
        addListener(event: "start", listener: () => void): this;
        addListener(event: "readDir", listener: () => void): this;
        addListener(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        addListener(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        addListener(event: "finish", listener: () => void): this;

        on(event: "start", listener: () => void): this;
        on(event: "readDir", listener: () => void): this;
        on(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        on(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        on(event: "finish", listener: () => void): this;

        once(event: "start", listener: () => void): this;
        once(event: "readDir", listener: () => void): this;
        once(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        once(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        once(event: "finish", listener: () => void): this;

        prependListener(event: "start", listener: () => void): this;
        prependListener(event: "readDir", listener: () => void): this;
        prependListener(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        prependListener(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        prependListener(event: "finish", listener: () => void): this;

        prependOncListener(event: "start", listener: () => void): this;
        prependOncListener(event: "readDir", listener: () => void): this;
        prependOncListener(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        prependOncListener(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        prependOncListener(event: "finish", listener: () => void): this;
    }

    abstract class RenderNewFrames extends EventEmitter {
        addListener(event: "start", listener: () => void): this;
        addListener(event: "renderStart", listener: (frameNumber?: number) => void): this;
        addListener(event: "renderFinish", listener: (frameNumber?: number) => void): this;
        addListener(event: "finish", listener: () => void): this;

        on(event: "start", listener: () => void): this;
        on(event: "renderStart", listener: (frameNumber?: number) => void): this;
        on(event: "renderFinish", listener: (frameNumber?: number) => void): this;
        on(event: "finish", listener: () => void): this;

        once(event: "start", listener: () => void): this;
        once(event: "renderStart", listener: (frameNumber?: number) => void): this;
        once(event: "renderFinish", listener: (frameNumber?: number) => void): this;
        once(event: "finish", listener: () => void): this;

        prependListener(event: "start", listener: () => void): this;
        prependListener(event: "renderStart", listener: (frameNumber?: number) => void): this;
        prependListener(event: "renderFinish", listener: (frameNumber?: number) => void): this;
        prependListener(event: "finish", listener: () => void): this;

        prependOnceListener(event: "start", listener: () => void): this;
        prependOnceListener(event: "renderStart", listener: (frameNumber?: number) => void): this;
        prependOnceListener(event: "renderFinish", listener: (frameNumber?: number) => void): this;
        prependOnceListener(event: "finish", listener: () => void): this;
    }

    abstract class GenerateEmbeddedCaptions extends EventEmitter {
        addListener(event: "start", listener: () => void): this;
        addListener(event: "writeStart", listener: (id?: string) => void): this;
        addListener(event: "writeFinish", listener: (id?: string) => void): this;
        addListener(event: "finish", listener: () => void): this;

        on(event: "start", listener: () => void): this;
        on(event: "writeStart", listener: (id?: string) => void): this;
        on(event: "writeFinish", listener: (id?: string) => void): this;
        on(event: "finish", listener: () => void): this;

        once(event: "start", listener: () => void): this;
        once(event: "writeStart", listener: (id?: string) => void): this;
        once(event: "writeFinish", listener: (id?: string) => void): this;
        once(event: "finish", listener: () => void): this;

        prependListener(event: "start", listener: () => void): this;
        prependListener(event: "writeStart", listener: (id?: string) => void): this;
        prependListener(event: "writeFinish", listener: (id?: string) => void): this;
        prependListener(event: "finish", listener: () => void): this;

        prependOnceListener(event: "start", listener: () => void): this;
        prependOnceListener(event: "writeStart", listener: (id?: string) => void): this;
        prependOnceListener(event: "writeFinish", listener: (id?: string) => void): this;
        prependOnceListener(event: "finish", listener: () => void): this;
    }

    interface GenerateVideoProgress {
        frames: number;
        totalFrames: number;
        size: number;
        progress: number;
        finished: boolean;
    }
    abstract class GenerateVideo extends EventEmitter {
        addListener(event: "start", listener: () => void): this;
        addListener(event: "checkFfmpegPathStart", listener: () => void): this;
        addListener(event: "checkFfmpegPathFinish", listener: () => void): this;
        addListener(event: "generateStart", listener: () => void): this;
        addListener(event: "generateProgress", listener: (progress?: GenerateVideoProgress) => void): this;
        addListener(event: "generateFinish", listener: () => void): this;
        addListener(event: "finish", listener: () => void): this;

        on(event: "start", listener: () => void): this;
        on(event: "checkFfmpegPathStart", listener: () => void): this;
        on(event: "checkFfmpegPathFinish", listener: () => void): this;
        on(event: "generateStart", listener: () => void): this;
        on(event: "generateProgress", listener: (progress?: GenerateVideoProgress) => void): this;
        on(event: "generateFinish", listener: () => void): this;
        on(event: "finish", listener: () => void): this;

        once(event: "start", listener: () => void): this;
        once(event: "checkFfmpegPathStart", listener: () => void): this;
        once(event: "checkFfmpegPathFinish", listener: () => void): this;
        once(event: "generateStart", listener: () => void): this;
        once(event: "generateProgress", listener: (progress?: GenerateVideoProgress) => void): this;
        once(event: "generateFinish", listener: () => void): this;
        once(event: "finish", listener: () => void): this;

        prependListener(event: "start", listener: () => void): this;
        prependListener(event: "checkFfmpegPathStart", listener: () => void): this;
        prependListener(event: "checkFfmpegPathFinish", listener: () => void): this;
        prependListener(event: "generateStart", listener: () => void): this;
        prependListener(event: "generateProgress", listener: (progress?: GenerateVideoProgress) => void): this;
        prependListener(event: "generateFinish", listener: () => void): this;
        prependListener(event: "finish", listener: () => void): this;

        prependOnceListener(event: "start", listener: () => void): this;
        prependOnceListener(event: "checkFfmpegPathStart", listener: () => void): this;
        prependOnceListener(event: "checkFfmpegPathFinish", listener: () => void): this;
        prependOnceListener(event: "generateStart", listener: () => void): this;
        prependOnceListener(event: "generateProgress", listener: (progress?: GenerateVideoProgress) => void): this;
        prependOnceListener(event: "generateFinish", listener: () => void): this;
        prependOnceListener(event: "finish", listener: () => void): this;
    }

    abstract class DeleteFrames extends EventEmitter {
        addListener(event: "start", listener: () => void): this;
        addListener(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        addListener(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        addListener(event: "finish", listener: () => void): this;

        on(event: "start", listener: () => void): this;
        on(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        on(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        on(event: "finish", listener: () => void): this;

        once(event: "start", listener: () => void): this;
        once(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        once(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        once(event: "finish", listener: () => void): this;

        prependListener(event: "start", listener: () => void): this;
        prependListener(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        prependListener(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        prependListener(event: "finish", listener: () => void): this;

        prependOnceListener(event: "start", listener: () => void): this;
        prependOnceListener(event: "deleteStart", listener: (frameNumber?: number) => void): this;
        prependOnceListener(event: "deleteFinish", listener: (frameNumber?: number) => void): this;
        prependOnceListener(event: "finish", listener: () => void): this;
    }

    abstract class DeleteCaptions extends EventEmitter {
        addListener(event: "start", listener: () => void): this;
        addListener(event: "deleteStart", listener: (id?: string) => void): this;
        addListener(event: "deleteFinish", listener: (id?: string) => void): this;
        addListener(event: "finish", listener: () => void): this;

        on(event: "start", listener: () => void): this;
        on(event: "deleteStart", listener: (id?: string) => void): this;
        on(event: "deleteFinish", listener: (id?: string) => void): this;
        on(event: "finish", listener: () => void): this;

        once(event: "start", listener: () => void): this;
        once(event: "deleteStart", listener: (id?: string) => void): this;
        once(event: "deleteFinish", listener: (id?: string) => void): this;
        once(event: "finish", listener: () => void): this;

        prependListener(event: "start", listener: () => void): this;
        prependListener(event: "deleteStart", listener: (id?: string) => void): this;
        prependListener(event: "deleteFinish", listener: (id?: string) => void): this;
        prependListener(event: "finish", listener: () => void): this;

        prependOnceListener(event: "start", listener: () => void): this;
        prependOnceListener(event: "deleteStart", listener: (id?: string) => void): this;
        prependOnceListener(event: "deleteFinish", listener: (id?: string) => void): this;
        prependOnceListener(event: "finish", listener: () => void): this;
    }

    abstract class GenerateSeparateCaptions extends EventEmitter {
        addListener(event: "start", listener: () => void): this;
        addListener(event: "writeStart", listener: (id?: string) => void): this;
        addListener(event: "writeFinish", listener: (id?: string) => void): this;
        addListener(event: "finish", listener: () => void): this;

        on(event: "start", listener: () => void): this;
        on(event: "writeStart", listener: (id?: string) => void): this;
        on(event: "writeFinish", listener: (id?: string) => void): this;
        on(event: "finish", listener: () => void): this;

        once(event: "start", listener: () => void): this;
        once(event: "writeStart", listener: (id?: string) => void): this;
        once(event: "writeFinish", listener: (id?: string) => void): this;
        once(event: "finish", listener: () => void): this;

        prependListener(event: "start", listener: () => void): this;
        prependListener(event: "writeStart", listener: (id?: string) => void): this;
        prependListener(event: "writeFinish", listener: (id?: string) => void): this;
        prependListener(event: "finish", listener: () => void): this;

        prependOnceListener(event: "start", listener: () => void): this;
        prependOnceListener(event: "writeStart", listener: (id?: string) => void): this;
        prependOnceListener(event: "writeFinish", listener: (id?: string) => void): this;
        prependOnceListener(event: "finish", listener: () => void): this;
    }
}

abstract class VideoExport extends EventEmitter {
    currentStage: ExportStages;
    currentTasks: Set<ExportTask>;

    checkTempPath: VideoExport.CheckTempPath;
    deleteExtraFrames: VideoExport.DeleteExtraFrames;
    renderNewFrames: VideoExport.RenderNewFrames;
    generateEmbeddedCaptions: VideoExport.GenerateEmbeddedCaptions;
    generateVideo: VideoExport.GenerateVideo;
    deleteFrames: VideoExport.DeleteFrames;
    deleteCaptions: VideoExport.DeleteCaptions;
    generateSeparateCaptions: VideoExport.GenerateSeparateCaptions;

    totalFrames: number;
    video: Video;

    addListener(event: "checkTempPath_start", listener: () => void): this;
    addListener(event: "checkTempPath_finish", listener: () => void): this;

    addListener(event: "deleteExtraFrames_start", listener: () => void): this;
    addListener(event: "deleteExtraFrames_readDir", listener: () => void): this;
    addListener(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    addListener(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    addListener(event: "deleteExtraFrames_finish", listener: () => void): this;

    addListener(event: "renderNewFrames_start", listener: () => void): this;
    addListener(event: "renderNewFrames_renderStart", listener: (frameNumber?: number) => void): this;
    addListener(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number) => void): this;
    addListener(event: "renderNewFrames_finish", listener: () => void): this;

    addListener(event: "generateEmbeddedCaptions_start", listener: () => void): this;
    addListener(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string) => void): this;
    addListener(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string) => void): this;
    addListener(event: "generateEmbeddedCaptions_finish", listener: () => void): this;

    addListener(event: "generateVideo_start", listener: () => void): this;
    addListener(event: "generateVideo_checkFfmpegPathStart", listener: () => void): this;
    addListener(event: "generateVideo_checkFfmpegPathFinish", listener: () => void): this;
    addListener(event: "generateVideo_generateStart", listener: () => void): this;
    addListener(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress) => void): this;
    addListener(event: "generateVideo_generateFinish", listener: () => void): this;
    addListener(event: "generateVideo_finish", listener: () => void): this;

    addListener(event: "deleteFrames_start", listener: () => void): this;
    addListener(event: "deleteFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    addListener(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    addListener(event: "deleteFrames_finish", listener: () => void): this;

    addListener(event: "deleteCaptions_start", listener: () => void): this;
    addListener(event: "deleteCaptions_deleteStart", listener: (id?: string) => void): this;
    addListener(event: "deleteCaptions_deleteFinish", listener: (id?: string) => void): this;
    addListener(event: "deleteCaptions_finish", listener: () => void): this;

    addListener(event: "start", listener: () => void): this;
    addListener(event: "writeStart", listener: (id?: string) => void): this;
    addListener(event: "writeFinish", listener: (id?: string) => void): this;
    addListener(event: "finish", listener: () => void): this;

    addListener(event: "start", listener: () => void): this;
    addListener(event: "finish", listener: () => void): this;
    addListener(event: "error", listener: (err: Error) => void): this;


    on(event: "checkTempPath_start", listener: () => void): this;
    on(event: "checkTempPath_finish", listener: () => void): this;

    on(event: "deleteExtraFrames_start", listener: () => void): this;
    on(event: "deleteExtraFrames_readDir", listener: () => void): this;
    on(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    on(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    on(event: "deleteExtraFrames_finish", listener: () => void): this;

    on(event: "renderNewFrames_start", listener: () => void): this;
    on(event: "renderNewFrames_renderStart", listener: (frameNumber?: number) => void): this;
    on(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number) => void): this;
    on(event: "renderNewFrames_finish", listener: () => void): this;

    on(event: "generateEmbeddedCaptions_start", listener: () => void): this;
    on(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string) => void): this;
    on(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string) => void): this;
    on(event: "generateEmbeddedCaptions_finish", listener: () => void): this;

    on(event: "generateVideo_start", listener: () => void): this;
    on(event: "generateVideo_checkFfmpegPathStart", listener: () => void): this;
    on(event: "generateVideo_checkFfmpegPathFinish", listener: () => void): this;
    on(event: "generateVideo_generateStart", listener: () => void): this;
    on(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress) => void): this;
    on(event: "generateVideo_generateFinish", listener: () => void): this;
    on(event: "generateVideo_finish", listener: () => void): this;

    on(event: "deleteFrames_start", listener: () => void): this;
    on(event: "deleteFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    on(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    on(event: "deleteFrames_finish", listener: () => void): this;

    on(event: "deleteCaptions_start", listener: () => void): this;
    on(event: "deleteCaptions_deleteStart", listener: (id?: string) => void): this;
    on(event: "deleteCaptions_deleteFinish", listener: (id?: string) => void): this;
    on(event: "deleteCaptions_finish", listener: () => void): this;

    on(event: "start", listener: () => void): this;
    on(event: "writeStart", listener: (id?: string) => void): this;
    on(event: "writeFinish", listener: (id?: string) => void): this;
    on(event: "finish", listener: () => void): this;

    on(event: "start", listener: () => void): this;
    on(event: "finish", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;


    once(event: "checkTempPath_start", listener: () => void): this;
    once(event: "checkTempPath_finish", listener: () => void): this;

    once(event: "deleteExtraFrames_start", listener: () => void): this;
    once(event: "deleteExtraFrames_readDir", listener: () => void): this;
    once(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    once(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    once(event: "deleteExtraFrames_finish", listener: () => void): this;

    once(event: "renderNewFrames_start", listener: () => void): this;
    once(event: "renderNewFrames_renderStart", listener: (frameNumber?: number) => void): this;
    once(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number) => void): this;
    once(event: "renderNewFrames_finish", listener: () => void): this;

    once(event: "generateEmbeddedCaptions_start", listener: () => void): this;
    once(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string) => void): this;
    once(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string) => void): this;
    once(event: "generateEmbeddedCaptions_finish", listener: () => void): this;

    once(event: "generateVideo_start", listener: () => void): this;
    once(event: "generateVideo_checkFfmpegPathStart", listener: () => void): this;
    once(event: "generateVideo_checkFfmpegPathFinish", listener: () => void): this;
    once(event: "generateVideo_generateStart", listener: () => void): this;
    once(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress) => void): this;
    once(event: "generateVideo_generateFinish", listener: () => void): this;
    once(event: "generateVideo_finish", listener: () => void): this;

    once(event: "deleteFrames_start", listener: () => void): this;
    once(event: "deleteFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    once(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    once(event: "deleteFrames_finish", listener: () => void): this;

    once(event: "deleteCaptions_start", listener: () => void): this;
    once(event: "deleteCaptions_deleteStart", listener: (id?: string) => void): this;
    once(event: "deleteCaptions_deleteFinish", listener: (id?: string) => void): this;
    once(event: "deleteCaptions_finish", listener: () => void): this;

    once(event: "start", listener: () => void): this;
    once(event: "writeStart", listener: (id?: string) => void): this;
    once(event: "writeFinish", listener: (id?: string) => void): this;
    once(event: "finish", listener: () => void): this;

    once(event: "start", listener: () => void): this;
    once(event: "finish", listener: () => void): this;
    once(event: "error", listener: (err: Error) => void): this;


    prependListener(event: "checkTempPath_start", listener: () => void): this;
    prependListener(event: "checkTempPath_finish", listener: () => void): this;

    prependListener(event: "deleteExtraFrames_start", listener: () => void): this;
    prependListener(event: "deleteExtraFrames_readDir", listener: () => void): this;
    prependListener(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    prependListener(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    prependListener(event: "deleteExtraFrames_finish", listener: () => void): this;

    prependListener(event: "renderNewFrames_start", listener: () => void): this;
    prependListener(event: "renderNewFrames_renderStart", listener: (frameNumber?: number) => void): this;
    prependListener(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number) => void): this;
    prependListener(event: "renderNewFrames_finish", listener: () => void): this;

    prependListener(event: "generateEmbeddedCaptions_start", listener: () => void): this;
    prependListener(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string) => void): this;
    prependListener(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string) => void): this;
    prependListener(event: "generateEmbeddedCaptions_finish", listener: () => void): this;

    prependListener(event: "generateVideo_start", listener: () => void): this;
    prependListener(event: "generateVideo_checkFfmpegPathStart", listener: () => void): this;
    prependListener(event: "generateVideo_checkFfmpegPathFinish", listener: () => void): this;
    prependListener(event: "generateVideo_generateStart", listener: () => void): this;
    prependListener(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress) => void): this;
    prependListener(event: "generateVideo_generateFinish", listener: () => void): this;
    prependListener(event: "generateVideo_finish", listener: () => void): this;

    prependListener(event: "deleteFrames_start", listener: () => void): this;
    prependListener(event: "deleteFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    prependListener(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    prependListener(event: "deleteFrames_finish", listener: () => void): this;

    prependListener(event: "deleteCaptions_start", listener: () => void): this;
    prependListener(event: "deleteCaptions_deleteStart", listener: (id?: string) => void): this;
    prependListener(event: "deleteCaptions_deleteFinish", listener: (id?: string) => void): this;
    prependListener(event: "deleteCaptions_finish", listener: () => void): this;

    prependListener(event: "start", listener: () => void): this;
    prependListener(event: "writeStart", listener: (id?: string) => void): this;
    prependListener(event: "writeFinish", listener: (id?: string) => void): this;
    prependListener(event: "finish", listener: () => void): this;

    prependListener(event: "start", listener: () => void): this;
    prependListener(event: "finish", listener: () => void): this;
    prependListener(event: "error", listener: (err: Error) => void): this;


    prependOnceListener(event: "checkTempPath_start", listener: () => void): this;
    prependOnceListener(event: "checkTempPath_finish", listener: () => void): this;

    prependOnceListener(event: "deleteExtraFrames_start", listener: () => void): this;
    prependOnceListener(event: "deleteExtraFrames_readDir", listener: () => void): this;
    prependOnceListener(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "deleteExtraFrames_finish", listener: () => void): this;

    prependOnceListener(event: "renderNewFrames_start", listener: () => void): this;
    prependOnceListener(event: "renderNewFrames_renderStart", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "renderNewFrames_finish", listener: () => void): this;

    prependOnceListener(event: "generateEmbeddedCaptions_start", listener: () => void): this;
    prependOnceListener(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string) => void): this;
    prependOnceListener(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string) => void): this;
    prependOnceListener(event: "generateEmbeddedCaptions_finish", listener: () => void): this;

    prependOnceListener(event: "generateVideo_start", listener: () => void): this;
    prependOnceListener(event: "generateVideo_checkFfmpegPathStart", listener: () => void): this;
    prependOnceListener(event: "generateVideo_checkFfmpegPathFinish", listener: () => void): this;
    prependOnceListener(event: "generateVideo_generateStart", listener: () => void): this;
    prependOnceListener(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress) => void): this;
    prependOnceListener(event: "generateVideo_generateFinish", listener: () => void): this;
    prependOnceListener(event: "generateVideo_finish", listener: () => void): this;

    prependOnceListener(event: "deleteFrames_start", listener: () => void): this;
    prependOnceListener(event: "deleteFrames_deleteStart", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "deleteFrames_finish", listener: () => void): this;

    prependOnceListener(event: "deleteCaptions_start", listener: () => void): this;
    prependOnceListener(event: "deleteCaptions_deleteStart", listener: (id?: string) => void): this;
    prependOnceListener(event: "deleteCaptions_deleteFinish", listener: (id?: string) => void): this;
    prependOnceListener(event: "deleteCaptions_finish", listener: () => void): this;

    prependOnceListener(event: "start", listener: () => void): this;
    prependOnceListener(event: "writeStart", listener: (id?: string) => void): this;
    prependOnceListener(event: "writeFinish", listener: (id?: string) => void): this;
    prependOnceListener(event: "finish", listener: () => void): this;

    prependOnceListener(event: "start", listener: () => void): this;
    prependOnceListener(event: "finish", listener: () => void): this;
    prependOnceListener(event: "error", listener: (err: Error) => void): this;
}

interface VideoJson {
    width: number;
    height: number;
    fps: number;
    scenes: Array<SceneJson>;
}

type output = string | {
    video: string;
    captions?: string | Map<string, string>;
    embeddedCaptions?: boolean | Set<string>;
};

export default class Video extends EventEmitter {
    static fromJson(json: string, parse?: true, throwErrors?: false, csMappings?: csMappings, caMappings?: caMappings<any>): Video | false;
    static fromJson(json: string, parse: true, throwErrors: true, csMappings?: csMappings, caMappings?: caMappings<any>): Video;
    static fromJson(json: any, parse: false, throwErrors?: false, csMappings?: csMappings, caMappings?: caMappings<any>): Video | false;
    static fromJson(json: any, parse: false, throwErrors: true, csMappings?: csMappings, caMappings?: caMappings<any>): Video;

    constructor(width: number, height: number, fps: number);
    constructor(size: RegularSize, fps: number);
    constructor(size: ShortSize, fps: number);
    constructor(options: RegularOptions);
    constructor(options: ShortOptions);
    constructor(options: RegularSquashedOptions);
    constructor(options: ShortSquashedOptions);

    readonly duration: number;
    scenes: Array<Scene>;
    width: number;
    height: number;
    fps: number;
    spf: number;
    tempPath: string;

    setWidth(width: number): this;
    setHeight(width: number): this;

    setSize(width: number, height: number): this;
    setSize(size: RegularSize): this;
    setSize(size: ShortSize): this;

    setFps(fps: number): this;
    setSpf(spf: number): this;

    setTempPath(path: string): this;

    add(scene: Scene): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): VideoJson;

    export(output: output, returnPromise?: false): this;
    export(output: output, returnPromise: true): Promise<undefined>;
    export(output: output, options: ExportOptions, returnPromise?: false): this;
    export(output: output, options: ExportOptions, returnPromise: true): Promise<undefined>;
    export(output: output, callback: (videoExport?: VideoExport) => void): this;
    export(output: output, options: ExportOptions, callback: (videoExport?: VideoExport) => void): this;

    addListener(event: "checkTempPath_start", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "checkTempPath_finish", listener: (videoExport?: VideoExport) => void): this;

    addListener(event: "deleteExtraFrames_start", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "deleteExtraFrames_readDir", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "deleteExtraFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    addListener(event: "renderNewFrames_start", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "renderNewFrames_renderStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "renderNewFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    addListener(event: "generateEmbeddedCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    addListener(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    addListener(event: "generateEmbeddedCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    addListener(event: "generateVideo_start", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "generateVideo_checkFfmpegPathStart", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "generateVideo_checkFfmpegPathFinish", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "generateVideo_generateStart", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress, videoExport?: VideoExport) => void): this;
    addListener(event: "generateVideo_generateFinish", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "generateVideo_finish", listener: (videoExport?: VideoExport) => void): this;

    addListener(event: "deleteFrames_start", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "deleteFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "deleteFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    addListener(event: "deleteCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "deleteCaptions_deleteStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    addListener(event: "deleteCaptions_deleteFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    addListener(event: "deleteCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    addListener(event: "start", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    addListener(event: "writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    addListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;

    addListener(event: "start", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "error", listener: (err: Error, videoExport?: VideoExport) => void): this;


    on(event: "checkTempPath_start", listener: (videoExport?: VideoExport) => void): this;
    on(event: "checkTempPath_finish", listener: (videoExport?: VideoExport) => void): this;

    on(event: "deleteExtraFrames_start", listener: (videoExport?: VideoExport) => void): this;
    on(event: "deleteExtraFrames_readDir", listener: (videoExport?: VideoExport) => void): this;
    on(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "deleteExtraFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    on(event: "renderNewFrames_start", listener: (videoExport?: VideoExport) => void): this;
    on(event: "renderNewFrames_renderStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "renderNewFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    on(event: "generateEmbeddedCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    on(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    on(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    on(event: "generateEmbeddedCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    on(event: "generateVideo_start", listener: (videoExport?: VideoExport) => void): this;
    on(event: "generateVideo_checkFfmpegPathStart", listener: (videoExport?: VideoExport) => void): this;
    on(event: "generateVideo_checkFfmpegPathFinish", listener: (videoExport?: VideoExport) => void): this;
    on(event: "generateVideo_generateStart", listener: (videoExport?: VideoExport) => void): this;
    on(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress, videoExport?: VideoExport) => void): this;
    on(event: "generateVideo_generateFinish", listener: (videoExport?: VideoExport) => void): this;
    on(event: "generateVideo_finish", listener: (videoExport?: VideoExport) => void): this;

    on(event: "deleteFrames_start", listener: (videoExport?: VideoExport) => void): this;
    on(event: "deleteFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "deleteFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    on(event: "deleteCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    on(event: "deleteCaptions_deleteStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    on(event: "deleteCaptions_deleteFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    on(event: "deleteCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    on(event: "start", listener: (videoExport?: VideoExport) => void): this;
    on(event: "writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    on(event: "writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    on(event: "finish", listener: (videoExport?: VideoExport) => void): this;

    on(event: "start", listener: (videoExport?: VideoExport) => void): this;
    on(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    on(event: "error", listener: (err: Error, videoExport?: VideoExport) => void): this;


    once(event: "checkTempPath_start", listener: (videoExport?: VideoExport) => void): this;
    once(event: "checkTempPath_finish", listener: (videoExport?: VideoExport) => void): this;

    once(event: "deleteExtraFrames_start", listener: (videoExport?: VideoExport) => void): this;
    once(event: "deleteExtraFrames_readDir", listener: (videoExport?: VideoExport) => void): this;
    once(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "deleteExtraFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    once(event: "renderNewFrames_start", listener: (videoExport?: VideoExport) => void): this;
    once(event: "renderNewFrames_renderStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "renderNewFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    once(event: "generateEmbeddedCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    once(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    once(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    once(event: "generateEmbeddedCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    once(event: "generateVideo_start", listener: (videoExport?: VideoExport) => void): this;
    once(event: "generateVideo_checkFfmpegPathStart", listener: (videoExport?: VideoExport) => void): this;
    once(event: "generateVideo_checkFfmpegPathFinish", listener: (videoExport?: VideoExport) => void): this;
    once(event: "generateVideo_generateStart", listener: (videoExport?: VideoExport) => void): this;
    once(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress, videoExport?: VideoExport) => void): this;
    once(event: "generateVideo_generateFinish", listener: (videoExport?: VideoExport) => void): this;
    once(event: "generateVideo_finish", listener: (videoExport?: VideoExport) => void): this;

    once(event: "deleteFrames_start", listener: (videoExport?: VideoExport) => void): this;
    once(event: "deleteFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "deleteFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    once(event: "deleteCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    once(event: "deleteCaptions_deleteStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    once(event: "deleteCaptions_deleteFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    once(event: "deleteCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    once(event: "start", listener: (videoExport?: VideoExport) => void): this;
    once(event: "writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    once(event: "writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    once(event: "finish", listener: (videoExport?: VideoExport) => void): this;

    once(event: "start", listener: (videoExport?: VideoExport) => void): this;
    once(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    once(event: "error", listener: (err: Error, videoExport?: VideoExport) => void): this;


    prependListener(event: "checkTempPath_start", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "checkTempPath_finish", listener: (videoExport?: VideoExport) => void): this;

    prependListener(event: "deleteExtraFrames_start", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteExtraFrames_readDir", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteExtraFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    prependListener(event: "renderNewFrames_start", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "renderNewFrames_renderStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "renderNewFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    prependListener(event: "generateEmbeddedCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependListener(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependListener(event: "generateEmbeddedCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    prependListener(event: "generateVideo_start", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "generateVideo_checkFfmpegPathStart", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "generateVideo_checkFfmpegPathFinish", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "generateVideo_generateStart", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress, videoExport?: VideoExport) => void): this;
    prependListener(event: "generateVideo_generateFinish", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "generateVideo_finish", listener: (videoExport?: VideoExport) => void): this;

    prependListener(event: "deleteFrames_start", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    prependListener(event: "deleteCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteCaptions_deleteStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteCaptions_deleteFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependListener(event: "deleteCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    prependListener(event: "start", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependListener(event: "writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;

    prependListener(event: "start", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "error", listener: (err: Error, videoExport?: VideoExport) => void): this;


    prependOnceListener(event: "checkTempPath_start", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "checkTempPath_finish", listener: (videoExport?: VideoExport) => void): this;

    prependOnceListener(event: "deleteExtraFrames_start", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteExtraFrames_readDir", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteExtraFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteExtraFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteExtraFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    prependOnceListener(event: "renderNewFrames_start", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "renderNewFrames_renderStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "renderNewFrames_renderFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "renderNewFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    prependOnceListener(event: "generateEmbeddedCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generateEmbeddedCaptions_writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generateEmbeddedCaptions_writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generateEmbeddedCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    prependOnceListener(event: "generateVideo_start", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generateVideo_checkFfmpegPathStart", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generateVideo_checkFfmpegPathFinish", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generateVideo_generateStart", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generateVideo_generateProgress", listener: (progress?: VideoExport.GenerateVideoProgress, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generateVideo_generateFinish", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generateVideo_finish", listener: (videoExport?: VideoExport) => void): this;

    prependOnceListener(event: "deleteFrames_start", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteFrames_deleteStart", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteFrames_deleteFinish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteFrames_finish", listener: (videoExport?: VideoExport) => void): this;

    prependOnceListener(event: "deleteCaptions_start", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteCaptions_deleteStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteCaptions_deleteFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "deleteCaptions_finish", listener: (videoExport?: VideoExport) => void): this;

    prependOnceListener(event: "start", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "writeStart", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "writeFinish", listener: (id?: string, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;

    prependOnceListener(event: "start", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "error", listener: (err: Error, videoExport?: VideoExport) => void): this;
}