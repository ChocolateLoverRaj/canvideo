//Main file that gets exported as npm module

export {
    tempPath,
    setTempPath,
    setFfmpegPath,
    getFfmpegPath,
    checkFfmpegPath,
    Video
} from "./video/video.js";

export {
    ExportStages,
    ExportTasks
} from "./video/stages.js";

export { default as Scene } from "./scene/scene.js";
export { default as Camera } from "./camera/camera.js";
export { default as Shape } from "./shapes/shape.js";
export { default as Rectangle } from "./shapes/rectangle.js";
export { default as Group } from "./shapes/group.js";
export { default as Circle } from "./shapes/circle.js";
export { default as Polygon } from "./shapes/polygon.js";
export { default as NumberLine } from "./shapes/number-line.js";
export { default as Path } from "./shapes/path.js";
export { default as Animation } from "./animations/animation.js";
export { default as Precomputed } from "./animations/precomputed.js";
export { default as Caption } from "./captions/caption.js";
export { default as createRouter } from "./server/server.js";