import { EventEmitter } from 'events';

declare function setTempPath(path: string): Promise<string>;

declare function setFfmpegPath(path: string): Promise<boolean>;

declare interface Progress {
    progress: number;
    count: number;
    total: number;
}

declare enum ExportSteps {
    RENDER_FRAMES = 0,
    GENERATE_VIDEO = 1,
    DELETE_FRAMES = 2,
    FINISHED = 3
}

declare abstract class VideoExport extends EventEmitter {
    totalFrames: number;
    currentStage: ExportSteps;//TODO change currentStage to currentStep

    addListener(event: "frame_progress", listener: (progress?: Progress) => void): this;
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

declare class Video extends EventEmitter {

    addListener(event: "frame_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    addListener(event: "frame_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    addListener(event: "frame_delete", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    addListener(event: "generate_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    addListener(event: "generate_progress", listener: (framesGenerated?: number, videoExport: VideoExport) => void): this;
    addListener(event: "delete_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    addListener(event: "delete_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    addListener(event: "step_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    addListener(event: "step_finish", listener: (step?: ExportSteps, videoExport: VideoExport) => void): this;
    addListener(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport: VideoExport) => void): this;
    addListener(event: "finish", listener: (videoExport: VideoExport) => void): this;
    addListener(event: "error", listener: (err?: Error, videoExport?: VideoExport) => void): this;

    on(event: "frame_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    on(event: "frame_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    on(event: "frame_delete", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    on(event: "generate_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    on(event: "generate_progress", listener: (framesGenerated?: number, videoExport: VideoExport) => void): this;
    on(event: "delete_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    on(event: "delete_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    on(event: "step_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    on(event: "step_finish", listener: (step?: ExportSteps, videoExport: VideoExport) => void): this;
    on(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport: VideoExport) => void): this;
    on(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    on(event: "error", listener: (err?: Error) => void, videoExport: VideoExport): this;

    once(event: "frame_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    once(event: "frame_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    once(event: "frame_delete", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    once(event: "generate_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    once(event: "generate_progress", listener: (framesGenerated?: number, videoExport: VideoExport) => void): this;
    once(event: "delete_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    once(event: "delete_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    once(event: "step_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    once(event: "step_finish", listener: (step?: ExportSteps, videoExport: VideoExport) => void): this;
    once(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport: VideoExport) => void): this;
    once(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    once(event: "error", listener: (err?: Error, videoExport: VideoExport) => void): this;

    prependListener(event: "frame_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    prependListener(event: "frame_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    prependListener(event: "frame_delete", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    prependListener(event: "generate_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    prependListener(event: "generate_progress", listener: (framesGenerated?: number, videoExport: VideoExport) => void): this;
    prependListener(event: "delete_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    prependListener(event: "delete_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    prependListener(event: "step_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    prependListener(event: "step_finish", listener: (step?: ExportSteps, videoExport: VideoExport) => void): this;
    prependListener(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport: VideoExport) => void): this;
    prependListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    prependListener(event: "error", listener: (err?: Error, videoExport: VideoExport) => void): this;

    prependOnceListener(event: "frame_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "frame_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "frame_delete", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "generate_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "generate_progress", listener: (framesGenerated?: number, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "delete_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "delete_finish", listener: (frameNumber?: number, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "step_progress", listener: (progress?: Progress, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "step_finish", listener: (step?: ExportSteps, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "any_progress", listener: (progress?: Progress, step?: ExportSteps, videoExport: VideoExport) => void): this;
    prependOnceListener(event: "finish", listener: (videoExport?: VideoExport) => void): this;
    prependOnceListener(event: "error", listener: (err?: Error, videoExport: VideoExport) => void): this;
}