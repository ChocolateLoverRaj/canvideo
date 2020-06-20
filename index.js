//Main file that gets exported as npm module

//Dependencies
const { setTempPath, setFfmpegPath, Video, ExportSteps } = require("./render/video");
const Scene = require("./render/scene");
const Camera = require("./render/camera");
const { Shape, Rectangle, Group, Circle, Polygon, NumberLine, Path } = require("./shapes/shapes");
const Animation = require("./animations/animation");

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
    NumberLine,
    Path,
    Animation
};