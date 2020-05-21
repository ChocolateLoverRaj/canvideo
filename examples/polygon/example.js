console.log("Started")

const canvideo = require("../../index");
const path = require('path');

canvideo.setTempPath(path.join(__dirname, "./res"));

var video = new canvideo.Video({ width: 400, height: 400 }, 24);

const f1 = {
    points: [
        {
            x: 400,
            y: 0
        },
        {
            x: 0,
            y: 0
        },
        {
            x: 400,
            y: 400
        }
    ]
}
const f2 = {
    points: [
        {
            x: 0,
            y: 0
        },
        {
            x: 0,
            y: 400
        },
        {
            x: 400,
            y: 0
        }
    ]
}
const f3 = {
    points: [
        {
            x: 0,
            y: 400
        },
        {
            x: 400,
            y: 400
        },
        {
            x: 0,
            y: 0
        }
    ]
}
const f4 = {
    points: [
        {
            x: 400,
            y: 400
        },
        {
            x: 400,
            y: 0
        },
        {
            x: 0,
            y: 400
        }
    ]
}

video
    .addKeyframe(new canvideo.Keyframe(0)
        .addShape(new canvideo.Polygon(400, 0, 0, 0, 400, 400)
            .inLayer(2)
            .fill("yellow")
            .animate(0, 0.5, new canvideo.Animation(f1, f2))
            .animate(0.5, 1, new canvideo.Animation(f2, f3))
            .animate(1, 1.5, new canvideo.Animation(f3, f4))
            .animate(1.5, 2, new canvideo.Animation(f4, f1))
        )
        .addShape(new canvideo.Polygon(0, 0, 200, 100, 400, 0, 300, 200, 400, 400, 200, 300, 0, 400, 100, 200)
            .inLayer(1)
            .fill("pink")
            .stroke("purple", 50)
        )
        .addShape(new canvideo.Square(0, 0, 400))
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