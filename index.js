//Main file that gets exported as npm module

export {
    tempPath,
    setTempPath,
    setFfmpegPath,
    getFfmpegPath,
    checkFfmpegPath,
    Video
} from "./node/video/video.js";

export {
    ExportStages,
    ExportTasks
} from "./node/video/stages.js";

export { default as Scene } from "./node/scene/scene.js";
export { default as Camera } from "./node/camera/camera.js";
export { default as Shape } from "./node/shapes/shape.js";
export { default as Rectangle } from "./node/shapes/rectangle.js";
export { default as Group } from "./node/shapes/group.js";
export { default as Circle } from "./node/shapes/circle.js";
export { default as Polygon } from "./node/shapes/polygon.js";
export { default as NumberLine } from "./node/shapes/number-line.js";
export { default as Path } from "./node/shapes/path.js";
export { default as Animation } from "./node/animations/animation.js";
export { default as Precomputed } from "./node/animations/precomputed.js";
export { default as Caption } from "./node/captions/caption.js";