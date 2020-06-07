//Main file that gets exported as npm module

//Dependencies
const Video = require("./render/video");
const Scene = require("./render/scene");
const { Camera } = require("./render/camera");
const { Shape, Rectangle } = require("./shapes");
const Animation = require("./animation");

//Export everything
module.exports = {
    Video,
    Scene,
    Camera,
    Shape,
    Rectangle,
    Animation
};