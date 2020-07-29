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
export { default as Shape } from "./common/shapes/shape.js";
export { default as Rectangle } from "./common/shapes/rectangle.js";
export { default as Group } from "./common/shapes/group.js";
export { default as Circle } from "./common/shapes/circle.js";
export { default as Polygon } from "./common/shapes/polygon.js";
export { default as NumberLine } from "./common/shapes/number-line.js";
export { default as Path } from "./common/shapes/path.js";
export { default as Animation } from "./common/animations/animation.js";
export { default as Precomputed } from "./common/animations/precomputed.js";
export { default as Caption } from "./node/captions/caption.js";
export { default as createRouter } from "./server/server.js";