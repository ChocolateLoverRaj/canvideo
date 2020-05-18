console.log("Started")

const canvideo = require("../../index");
const path = require('path');

canvideo.setTempPath(path.join(__dirname, "./res"));

var video = new canvideo.Video({ width: 400, height: 400 }, 24);

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
        .addShape(new canvideo.Rectangle(0, 0, 100, 100, "white")
            .animate(0, 2, new canvideo.Animation({ x: 0, color: { alpha: 1 } }, { x: 300, color: { alpha: 0 } })
                .reverse()
            )
        )
    )
    .addKeyframe(new canvideo.Keyframe((24 * 1 + 23) / 24))
    .export(path.join(__dirname, "./res/output.mp4"));

video.on("done", () => {
    console.log("done")
});
video.on("error", () => {
    console.log("error!");
});

//video.export(path.join(__dirname, "./res/output.mp4"));