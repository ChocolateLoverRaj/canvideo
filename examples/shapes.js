const canvideo = require("../index");
const path = require('path');

canvideo.setTempPath(path.join(__dirname, "./res"));

var animation = new canvideo.Animation({ width: 400, height: 400 }, 1);

animation
    .addKeyframe(new canvideo.Keyframe(0)
        .addShape(new canvideo.Rectangle(0, 0, 200, 200, [255, 0, 0, 0.5]))
    )
    .addKeyframe(new canvideo.Keyframe(1)
        .addShape(new canvideo.Rectangle(100, 100, 200, 200, new canvideo.Color([0, 255, 0, 0.5])))
    )
    .addKeyframe(new canvideo.Keyframe(2)
        .addShape(new canvideo.Rectangle(200, 200, 200, 200, new canvideo.Color(0, 0, 255, 0.5)))
    )

animation.on("done", () => {
    console.log("done")
});
animation.on("error", () => {
    console.log("error!");
});

animation.export(path.join(__dirname, "./res/output.mp4"));