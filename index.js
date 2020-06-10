//Main file that gets exported as npm module

//Dependencies
const { setTempPath, setFfmpegPath, Video, ExportSteps } = require("./render/video");
const Scene = require("./render/scene");
const Camera = require("./render/camera");
const { Shape, Rectangle, Group, Circle, Polygon } = require("./shapes");
const Animation = require("./animation");

//Export everything
module.exports = {
    setTempPath,
    setFfmpegPath,
    Video,
    ExportSteps,
    Scene,
    Camera,
    Shape,
    Rectangle,
    Group,
    Circle,
    Polygon,
    Animation
};