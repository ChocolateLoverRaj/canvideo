import { EventEmitter } from "../../common/event-emitter/event-emitter";
import Scene from "../scene/scene";
import SceneJson from "../scene/scene-json";
import csMappings from "../../common/shapes/cs-mappings";
import { caMappings } from '../../common/animations/animanaged';
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

export namespace VideoExport {
    interface CheckTempPathEvents {
        start: () => void;
        finish: () => void;
    }

    interface DeleteExtraFramesEvents {
        start: () => void;
        readDir: () => void;
        deleteStart: (frameNumber?: number) => void;
        deleteFinish: (frameNumber?: number) => void;
        finish: () => void;
    }

    interface RenderNewFramesEvents {
        start: () => void;
        deleteStart: (frameNumber?: number) => void;
        deleteFinish: (frameNumber?: number) => void;
        finish: () => void;
    }

    interface GenerateEmbeddedCaptionsEvents {
        write: () => void;
        writeStart: (id?: string) => void;
        writeFinish: (id?: string) => void;
        finish: () => void;
    }

    interface GenerateVideoProgress {
        frames: number;
        totalFrames: number;
        size: number;
        progress: number;
        finished: boolean;
    }
    interface GenerateVideoEvents {
        start: () => void;
        checkFfmpegPathStart: () => void;
        checkFfmpegPathFinish: () => void;
        generateStart: () => void;
        generateProgress: (progress?: GenerateVideoProgress) => void;
        generateFinish: () => void;
        finish: () => void;
    }

    interface DeleteFramesEvents {
        start: () => void;
        deleteStart: (frameNumber?: number) => void;
        deleteFinish: (frameNumber?: number) => void;
        finish: () => void;
    }

    interface DeleteCaptionsEvents {
        start: () => void;
        deleteStart: (id?: string) => void;
        deleteFinish: (id?: string) => void;
        finish: () => void;
    }

    interface GenerateSeparateCaptionsEvents {
        start: () => void;
        writeStart: (id?: string) => void;
        writeFinish: (id?: string) => void;
        finish: () => void;
    }
}

interface VideoExportEvents {
    checkTempPath_start: () => void;
    checkTempPath_finish: () => void;

    deleteExtraFrames_start: () => void;
    deleteExtraFrames_readDir: () => void;
    deleteExtraFrames_deleteStart: (frameNumber?: number) => void;
    deleteExtraFrames_deleteFinish: (frameNumber?: number) => void;
    deleteExtraFrames_finish: () => void;

    renderNewFrames_start: () => void;
    renderNewFrames_renderStart: (frameNumber?: number) => void;
    renderNewFrames_renderFinish: (frameNumber?: number) => void;
    renderNewFrames_finish: () => void;

    generateEmbeddedCaptions_start: () => void;
    generateEmbeddedCaptions_writeStart: (id?: string) => void;
    generateEmbeddedCaptions_writeFinish: (id?: string) => void;
    generateEmbeddedCaptions_finish: () => void;

    generateVideo_start: () => void;
    generateVideo_checkFfmpegPathStart: () => void;
    generateVideo_generateStart: () => void;
    generateVideo_generateProgress: (progress?: VideoExport.GenerateVideoProgress) => void;
    generateVideo_generateFinish: () => void;
    generateVideo_finish: () => void;

    deleteFrames_start: () => void;
    deleteFrames_deleteStart: (frameNumber?: number) => void;
    deleteFrames_deleteFinish: (frameNumber?: number) => void;
    deleteFrames_finish: () => void;

    deleteCaptions_start: () => void;
    deleteCaptions_deleteStart: (id?: string) => void;
    deleteCaptions_deleteFinish: (id?: string) => void;
    deleteCaptions_finish: () => void;

    generateSeparateCaptions_start: () => void;
    generateSeparateCaptions_writeStart: (id?: string) => void;
    generateSeparateCaptions_writeFinish: (id?: string) => void;
    generateSeparateCaptions_finish: () => void;

    start: () => void;
    finish: () => void;
    error: (err: Error) => void;
}
export abstract class VideoExport extends EventEmitter<VideoExportEvents> {
    currentStage: ExportStages;
    currentTasks: Set<ExportTask>;

    checkTempPath: EventEmitter<VideoExport.CheckTempPathEvents>;
    deleteExtraFrames: EventEmitter<VideoExport.DeleteExtraFramesEvents>;
    renderNewFrames: EventEmitter<VideoExport.RenderNewFramesEvents>;
    generateEmbeddedCaptions: EventEmitter<VideoExport.GenerateEmbeddedCaptionsEvents>;
    generateVideo: EventEmitter<VideoExport.GenerateVideoEvents>;
    deleteFrames: EventEmitter<VideoExport.DeleteFramesEvents>;
    deleteCaptions: EventEmitter<VideoExport.DeleteCaptionsEvents>;
    generateSeparateCaptions: EventEmitter<VideoExport.GenerateSeparateCaptionsEvents>;

    totalFrames: number;
    video: Video;
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

interface VideoEvents {
    checkTempPath_start: (videoExport?: VideoExport) => void;
    checkTempPath_finish: (videoExport?: VideoExport) => void;

    deleteExtraFrames_start: (videoExport?: VideoExport) => void;
    deleteExtraFrames_readDir: (videoExport?: VideoExport) => void;
    deleteExtraFrames_deleteStart: (frameNumber?: number, videoExport?: VideoExport) => void;
    deleteExtraFrames_deleteFinish: (frameNumber?: number, videoExport?: VideoExport) => void;
    deleteExtraFrames_finish: (videoExport?: VideoExport) => void;

    renderNewFrames_start: (videoExport?: VideoExport) => void;
    renderNewFrames_renderStart: (frameNumber?: number, videoExport?: VideoExport) => void;
    renderNewFrames_renderFinish: (frameNumber?: number, videoExport?: VideoExport) => void;
    renderNewFrames_finish: (videoExport?: VideoExport) => void;

    generateEmbeddedCaptions_start: (videoExport?: VideoExport) => void;
    generateEmbeddedCaptions_writeStart: (id?: string, videoExport?: VideoExport) => void;
    generateEmbeddedCaptions_writeFinish: (id?: string, videoExport?: VideoExport) => void;
    generateEmbeddedCaptions_finish: (videoExport?: VideoExport) => void;

    generateVideo_start: (videoExport?: VideoExport) => void;
    generateVideo_checkFfmpegPathStart: (videoExport?: VideoExport) => void;
    generateVideo_generateStart: (videoExport?: VideoExport) => void;
    generateVideo_generateProgress: (progress?: VideoExport.GenerateVideoProgress, videoExport?: VideoExport) => void;
    generateVideo_generateFinish: (videoExport?: VideoExport) => void;
    generateVideo_finish: (videoExport?: VideoExport) => void;

    deleteFrames_start: (videoExport?: VideoExport) => void;
    deleteFrames_deleteStart: (frameNumber?: number, videoExport?: VideoExport) => void;
    deleteFrames_deleteFinish: (frameNumber?: number, videoExport?: VideoExport) => void;
    deleteFrames_finish: (videoExport?: VideoExport) => void;

    deleteCaptions_start: (videoExport?: VideoExport) => void;
    deleteCaptions_deleteStart: (id?: string, videoExport?: VideoExport) => void;
    deleteCaptions_deleteFinish: (id?: string, videoExport?: VideoExport) => void;
    deleteCaptions_finish: (videoExport?: VideoExport) => void;

    generateSeparateCaptions_start: (videoExport?: VideoExport) => void;
    generateSeparateCaptions_writeStart: (id?: string, videoExport?: VideoExport) => void;
    generateSeparateCaptions_writeFinish: (id?: string, videoExport?: VideoExport) => void;
    generateSeparateCaptions_finish: (videoExport?: VideoExport) => void;

    start: (videoExport?: VideoExport) => void;
    finish: (videoExport?: VideoExport) => void;
    error: (err: Error, videoExport?: VideoExport) => void;
}
export default class Video extends EventEmitter<VideoEvents> {
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
}