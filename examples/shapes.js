const canvideo = require("../index");

canvideo.setTempPath("C://Users/jui/Desktop/Trash");

var animation = new canvideo.Animation();


animation
    .addKeyframe(new canvideo.Keyframe()
        .addShape(new canvideo.Rectangle(0, 0, 100, 100, "blue"))
        .addShape(new canvideo.Rectangle(50, 50, 100, 100, "cyan"))
        .addShape(new canvideo.Rectangle(100, 100, 100, 100, "white"))
    )
    .addKeyframe(new canvideo.Keyframe()
        .addShape(new canvideo.Rectangle(100, 100, 100, 100, "white"))
        .addShape(new canvideo.Rectangle(50, 50, 100, 100, "cyan"))
        .addShape(new canvideo.Rectangle(0, 0, 100, 100, "blue"))
    )

animation.on("done", () => {
    console.log("done")
});
animation.on("error", () => {
    console.log("error!");
});

animation.export("C://Users/jui/Desktop/Trash/output.mp4");