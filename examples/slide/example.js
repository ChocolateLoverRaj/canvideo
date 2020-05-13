const canvideo = require("../../index");
const path = require('path');

canvideo.setTempPath(path.join(__dirname, "./res"));

var video = new canvideo.Video({ width: 600, height: 600 }, 2);

video

video.on("done", () => {
    console.log("done")
});
video.on("error", () => {
    console.log("error!");
});

video.export(path.join(__dirname, "./res/output.mp4"));