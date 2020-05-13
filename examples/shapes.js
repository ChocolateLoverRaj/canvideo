const canvideo = require("../index");
const path = require('path');

canvideo.setTempPath(path.join(__dirname, "./res"));

var animation = new canvideo.Animation({ width: 600, height: 600 }, 2);

animation
    .addKeyframe(new canvideo.Keyframe(0)
        .addShape(new canvideo.Rectangle(300, 300, 300, 300, "green")
            .setDeleteTime(0.5)
        )
        .addShape(new canvideo.Rectangle(400, 400, 300, 300, "blue")
            .setDeleteTime(1)
        )
        .addShape(new canvideo.Rectangle(500, 500, 300, 300, "purple")
            .setDeleteTime(1.5)
        )
    )
    .addKeyframe(new canvideo.Keyframe(0.5)
        .addShape(new canvideo.Rectangle(0, 0, 300, 300, "red")
            .setDeleteTime(2)
        )
    )
    .addKeyframe(new canvideo.Keyframe(1)
        .addShape(new canvideo.Rectangle(100, 100, 300, 300, "orange")
            .setDeleteTime(2.5)
        )
    )
    .addKeyframe(new canvideo.Keyframe(1.5)
        .addShape(new canvideo.Rectangle(200, 200, 300, 300, "yellow")
        )
    )
    .addKeyframe(new canvideo.Keyframe(2)
        .addShape(new canvideo.Rectangle(300, 300, 300, 300, "green")
        )
    )
    .addKeyframe(new canvideo.Keyframe(2.5)
        .addShape(new canvideo.Rectangle(400, 400, 300, 300, "blue")
        )
    )


animation.on("done", () => {
    console.log("done")
});
animation.on("error", () => {
    console.log("error!");
});

animation.export(path.join(__dirname, "./res/output.mp4"));