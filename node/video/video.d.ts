import VideoClass from "./classes";

export declare var tempPath: string;
export declare function setTempPath(path: string): Promise<string>;

export declare function setFfmpegPath(path: string): void;
export declare function getFfmpegPath(): string;
export declare function checkFfmpegPath(): Promise<void>;

export declare class Video extends VideoClass { }