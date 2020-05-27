const canvideo = require("../../index");
const path = require('path');

console.log("Started.");

canvideo.setTempPath(path.join(__dirname, "./res"));

var video = new canvideo.Video({ width: 400, height: 400 }, 24);

video
    .addKeyframe(new canvideo.Keyframe(0)
        .addShape(new canvideo.Square(0, 0, 400)
            .fill("white")
        )
        .addShape(new canvideo.Square(0, 0, 200)
            .fill("green")
        )
        .addShape(new canvideo.Square(0, 0, 100)
            .fill("blue")
        )
        .addShape(new canvideo.Square(200, 200, 100)
            .fill("red")
        )
        .addShape(new canvideo.Square(200, 150, 50)
            .fill("purple")
        )
    );

video.camera.animate(0, 2, new canvideo.ZoomAnimation({ scaleX: 1, scaleY: 1}, { scaleX: 2, scaleY: 2}, 200, 200).reverse());

video.on("done", () => {
    console.log("done")
});
video.on("error", () => {
    console.log("error!");
});

video.export(path.join(__dirname, "./res/output.mp4"));