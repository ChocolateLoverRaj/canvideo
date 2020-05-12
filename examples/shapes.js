const canvideo = require("../index");
const path = require('path');

canvideo.setTempPath(path.join(__dirname, "./res"));

var animation = new canvideo.Animation({ width: 200, height: 200 }, 4);

animation
    .addKeyframe(new canvideo.Keyframe(0.25)
        .addShape(new canvideo.Rectangle(0, 0, 100, 100, "blue"))
    )
    .addKeyframe(new canvideo.Keyframe(0.5)
        .addShape(new canvideo.Rectangle(50, 50, 100, 100, "cyan"))
    )
    .addKeyframe(new canvideo.Keyframe(0.75)
        .addShape(new canvideo.Rectangle(100, 100, 100, 100, "white"))
    )

animation.on("done", () => {
    console.log("done")
});
animation.on("error", () => {
    console.log("error!");
});

animation.export(path.join(__dirname, "./res/output.mp4"));