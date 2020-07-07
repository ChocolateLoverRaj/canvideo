import { EventEmitter } from 'events';

import { SceneJson, Scene } from "./scene";
import csMappings from "../shapes/cs-mappings";
import { caMappings } from '../animations/animanaged';

export declare var tempPath: string;
export declare function setTempPath(path: string): Promise<string>;

export declare function setFfmpegPath(path: string): void;
export declare function getFfmpegPath(): string;
export declare function checkFfmpegPath(): Promise<void>;

declare interface Progress {
    progress: number;
    count: number;
    total: number;
}

export declare enum ExportStages {
    START = "START",
    CREATE_FILES = "CREATE_FILES",
    GENERATE_VIDEO = "GENERATE_VIDEO",
    DELETE_TEMPORARY = "DELETE_FRAMES",
    FINISH = "FINISH"
}

declare interface ExportTask {
    name: string;
    start: ExportStages;
    end: ExportStages;
}

export declare abstract class ExportTasks {
    static CHECK_TEMP_PATH: ExportTask;
    static DELETE_EXTRA_FRAMES: ExportTask;
    static RENDER_NEW_FRAMES: ExportTask;
    static GENERATE_SEPARATE_CAPTIONS: ExportTask;
    static GENERATE_EMBEDDED_CAPTIONS: ExportTask;
    static GENERATE_VIDEO: ExportTask;
    static DELETE_FRAMES: ExportTask;
    static DELETE_CAPTIONS: ExportTask;
}

declare interface RegularSize {
    width: number;
    height: number;
}
declare interface ShortSize {
    w: number;
    h: number;
}

declare interface RegularOptions extends RegularSize {
    fps: number;
}
declare interface ShortOptions extends ShortSize {
    fps: number;
}

declare interface RegularSquashedOptions {
    size: RegularSize;
    fps: number;
}
declare interface ShortSquashedOptions {
    size: ShortSize;
    fps: number;
}

declare interface ExportOptions {
    keepImages?: boolean;
    maxStreams?: number;
}

declare abstract class VideoExport extends EventEmitter {
    currentStage: ExportStages;
    currentTasks: Set<ExportTask>;

    checkTempPath: EventEmitter;
    deleteExtraFrames: EventEmitter;
    renderNewFrames: EventEmitter;
    generateEmbeddedCaptions: EventEmitter;
    generateVideo: EventEmitter;
    deleteFrames: EventEmitter;
    deleteCaptions: EventEmitter;
    generateSeparateCaptions: EventEmitter;

    totalFrames: number;
    currentStep: ExportSteps;
    video: Video;

    addListener(event: "frame_progress", listener: (progress?: Progress) => void): this;
    addListener(event: "frame_start", listener: (frameNumber?: number) => void): this;
    addListener(event: "frame_finish", listener: (frameNumber?: number) => void): this;
    addListener(event: "frame_delete", listener: (frameNumber?: number) => void): this;
    addListener(event: "generate_progress", listener: (progress?: Progress) => void): this;
    addListener(event: "generate_progress", listener: (framesGenerated?: number) => void): this;
    addListener(event: "delete_progress", listener: (progress?: Progress) => void): this;
    addListener(event: "delete_finish", listener: (frameNumber?: number) => void): this;
    addListener(event: "step_progress", listener: (progress?: Progress) => void): this;
    addListener(event: "step_finish", listener: (step?: ExportSteps) => void): this;
    addListener(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps) => void): this;
    addListener(event: "finish", listener: () => void): this;
    addListener(event: "error", listener: (err?: Error) => void): this;

    on(event: "frame_progress", listener: (progress?: Progress) => void): this;
    on(event: "frame_start", listener: (frameNumber?: number) => void): this;
    on(event: "frame_finish", listener: (frameNumber?: number) => void): this;
    on(event: "frame_delete", listener: (frameNumber?: number) => void): this;
    on(event: "generate_progress", listener: (progress?: Progress) => void): this;
    on(event: "generate_progress", listener: (framesGenerated?: number) => void): this;
    on(event: "delete_progress", listener: (progress?: Progress) => void): this;
    on(event: "delete_finish", listener: (frameNumber?: number) => void): this;
    on(event: "step_progress", listener: (progress?: Progress) => void): this;
    on(event: "step_finish", listener: (step?: ExportSteps) => void): this;
    on(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps) => void): this;
    on(event: "finish", listener: () => void): this;
    on(event: "error", listener: (err?: Error) => void): this;

    once(event: "frame_progress", listener: (progress?: Progress) => void): this;
    once(event: "frame_start", listener: (frameNumber?: number) => void): this;
    once(event: "frame_finish", listener: (frameNumber?: number) => void): this;
    once(event: "frame_delete", listener: (frameNumber?: number) => void): this;
    once(event: "generate_progress", listener: (progress?: Progress) => void): this;
    once(event: "generate_progress", listener: (framesGenerated?: number) => void): this;
    once(event: "delete_progress", listener: (progress?: Progress) => void): this;
    once(event: "delete_finish", listener: (frameNumber?: number) => void): this;
    once(event: "step_progress", listener: (progress?: Progress) => void): this;
    once(event: "step_finish", listener: (step?: ExportSteps) => void): this;
    once(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps) => void): this;
    once(event: "finish", listener: () => void): this;
    once(event: "error", listener: (err?: Error) => void): this;

    prependListener(event: "frame_progress", listener: (progress?: Progress) => void): this;
    prependListener(event: "frame_start", listener: (frameNumber?: number) => void): this;
    prependListener(event: "frame_finish", listener: (frameNumber?: number) => void): this;
    prependListener(event: "frame_delete", listener: (frameNumber?: number) => void): this;
    prependListener(event: "generate_progress", listener: (progress?: Progress) => void): this;
    prependListener(event: "generate_progress", listener: (framesGenerated?: number) => void): this;
    prependListener(event: "delete_progress", listener: (progress?: Progress) => void): this;
    prependListener(event: "delete_finish", listener: (frameNumber?: number) => void): this;
    prependListener(event: "step_progress", listener: (progress?: Progress) => void): this;
    prependListener(event: "step_finish", listener: (step?: ExportSteps) => void): this;
    prependListener(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps) => void): this;
    prependListener(event: "finish", listener: () => void): this;
    prependListener(event: "error", listener: (err?: Error) => void): this;

    prependOnceListener(event: "frame_progress", listener: (progress?: Progress) => void): this;
    prependOnceListener(event: "frame_start", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "frame_finish", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "frame_delete", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "generate_progress", listener: (progress?: Progress) => void): this;
    prependOnceListener(event: "generate_progress", listener: (framesGenerated?: number) => void): this;
    prependOnceListener(event: "delete_progress", listener: (progress?: Progress) => void): this;
    prependOnceListener(event: "delete_finish", listener: (frameNumber?: number) => void): this;
    prependOnceListener(event: "step_progress", listener: (progress?: Progress) => void): this;
    prependOnceListener(event: "step_finish", listener: (step?: ExportSteps) => void): this;
    prependOnceListener(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps) => void): this;
    prependOnceListener(event: "finish", listener: () => void): this;
    prependOnceListener(event: "error", listener: (err?: Error) => void): this;
}

declare interface VideoJson {
    width: number;
    height: number;
    fps: number;
    scenes: Array<SceneJson>;
}

declare type output = string | {
    video: string;
    captions?: string | Map<string, string>;
    embeddedCaptions?: boolean | Set<string>;
};

export declare class Video extends EventEmitter {
    static fromJson(json: string, parse?: true, throwErrors?: false, csMappings?: csMappings, caMappings?: caMappings): Video | false;
    static fromJson(json: string, parse?: true, throwErrors: true, csMappings?: csMappings, caMappings?: caMappings): Video;
    static fromJson(json: any, parse: false, throwErrors?: false, csMappings?: csMappings, caMappings?: caMappings): Video | false;
    static fromJson(json: any, parse: false, throwErrors: true, csMappings?: csMappings, caMappings?: caMappings): Video;

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

    addListener(event: "frame_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    addListener(event: "frame_start", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "frame_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "frame_delete", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "generate_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    addListener(event: "generate_progress", listener: (framesGenerated?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "delete_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    addListener(event: "delete_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    addListener(event: "step_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    addListener(event: "step_finish", listener: (step?: ExportSteps, videoExport?: VideoExport) => void): this;
    addListener(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport?: VideoExport) => void): this;
    addListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    addListener(event: "error", listener: (err?: Error, videoExport?: VideoExport) => void): this;

    on(event: "frame_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    on(event: "frame_start", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "frame_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "frame_delete", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "generate_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    on(event: "generate_progress", listener: (framesGenerated?: number, videoExport?: VideoExport) => void): this;
    on(event: "delete_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    on(event: "delete_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    on(event: "step_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    on(event: "step_finish", listener: (step?: ExportSteps, videoExport?: VideoExport) => void): this;
    on(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport?: VideoExport) => void): this;
    on(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    on(event: "error", listener: (err?: Error) => void, videoExport?: VideoExport): this;

    once(event: "frame_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    once(event: "frame_start", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "frame_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "frame_delete", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "generate_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    once(event: "generate_progress", listener: (framesGenerated?: number, videoExport?: VideoExport) => void): this;
    once(event: "delete_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    once(event: "delete_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    once(event: "step_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    once(event: "step_finish", listener: (step?: ExportSteps, videoExport?: VideoExport) => void): this;
    once(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport?: VideoExport) => void): this;
    once(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    once(event: "error", listener: (err?: Error, videoExport?: VideoExport) => void): this;

    prependListener(event: "frame_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    prependListener(event: "frame_start", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "frame_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "frame_delete", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "generate_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    prependListener(event: "generate_progress", listener: (framesGenerated?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "delete_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    prependListener(event: "delete_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependListener(event: "step_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    prependListener(event: "step_finish", listener: (step?: ExportSteps, videoExport?: VideoExport) => void): this;
    prependListener(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport?: VideoExport) => void): this;
    prependListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "error", listener: (err?: Error, videoExport?: VideoExport) => void): this;

    prependOnceListener(event: "frame_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "frame_start", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "frame_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "frame_delete", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generate_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "generate_progress", listener: (framesGenerated?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "delete_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "delete_finish", listener: (frameNumber?: number, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "step_progress", listener: (progress?: Progress, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "step_finish", listener: (step?: ExportSteps, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "error", listener: (err?: Error, videoExport?: VideoExport) => void): this;
}