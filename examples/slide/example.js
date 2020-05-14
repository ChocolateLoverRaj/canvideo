console.log("Started")

const canvideo = require("../../index");
const path = require('path');

canvideo.setTempPath(path.join(__dirname, "./res"));

var video = new canvideo.Video({ width: 400, height: 400 }, 60);

var vertical = {
    x: 200,
    y: 0,
    width: 0,
    height: 400
};
var horizontal = {
    x: 0,
    y: 200,
    width: 400,
    height: 0
}

video
    .addKeyframe(new canvideo.Keyframe(0)
        .addShape(new canvideo.Rectangle(200, 0, 0, 200, "green")
            .animate(0, 2, new canvideo.Animation(vertical, horizontal)
                .reverse()
            )
        )
        .addShape(new canvideo.Rectangle(0, 200, 200, 0, "white")
            .animate(0, 2, new canvideo.Animation(horizontal, vertical)
                .reverse()
            )
        )
        .addShape(new canvideo.Rectangle(0, 0, 100, 100, "brown")
            .animate(0, 1, new canvideo.Animation({ x: 0 }, { x: 300 })
                .last()
            )
        )
    )
    .addKeyframe(new canvideo.Keyframe(119 / 60))
    .export(path.join(__dirname, "./res/output.mp4"));


video.on("done", () => {
    console.log("done")
});
video.on("error", () => {
    console.log("error!");
});

//video.export(path.join(__dirname, "./res/output.mp4"));