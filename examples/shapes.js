const canvideo = require("../index");

var animation = new canvideo.Animation();
canvideo.setTempPath("C://Users/username/Desktop/Trash")


animation.add(new canvideo.Rectangle(50, 50, 100, 100, "cyan"));
animation.add(new canvideo.Rectangle(100, 100, 100, 100, "magenta"));

animation.on("end", () => {
    console.log("done")
});

animation.export("C://Users/username/Desktop/Trash/output.mp4");