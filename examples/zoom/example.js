const canvideo = require("../../index");
const path = require('path');

console.log("Started.");

canvideo.setTempPath(path.join(__dirname, "./res"));

var video = new canvideo.Video({ width: 400, height: 400 }, 24);

video
    .addKeyframe(new canvideo.Keyframe(0)
        .addShape(new canvideo.Square(0, 0, 800)
            .fill("white")
        )
        .addShape(new canvideo.Rectangle(0, 0, 200, 200)
            .fill("green")
        )
    )

video.camera.animate(0, 2, new canvideo.Animation({ zoom: 1 }, { zoom: 0.5 }));

video.on("done", () => {
    console.log("done")
});
video.on("error", () => {
    console.log("error!");
});

video.export(path.join(__dirname, "./res/output.mp4"));