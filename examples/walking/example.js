console.log("Started")

const canvideo = require("../../index");
const path = require('path');

canvideo.setTempPath(path.join(__dirname, "./res"));

var video = new canvideo.Video({ width: 400, height: 400 }, 24);

var keyFrame = new canvideo.Keyframe(0)
    .addShape(new canvideo.Rectangle(130, 0, 140, 400)
        .fill("brown")
        .setAt(0, { fillColor: { a: 0.5 } })
        .stroke("brown", 25)
    )
    .addShape(new canvideo.Triangle(200, 25, 100, 75, 300, 75, 2)
        .fill("red")
        .animate(0, 1, new canvideo.Animation({ fillColor: { b: 0 } }, { fillColor: { b: 255 } })
            .reverse()
        )
    )
    .addShape(new canvideo.Rectangle(175, 75, 50, 25, 1)
        .fill("tan")
    )
    .addShape(new canvideo.Rectangle(150, 100, 100, 100, 1)
        .fill("red")
    )
    .addShape(new canvideo.Rectangle(125, 100, 25, 100, 1)
        .fill("tan")
        .animate(0, 1, new canvideo.Animation({ height: 80 }, { height: 120 })
            .reverse()
        )
    )
    .addShape(new canvideo.Rectangle(250, 100, 25, 100, 1)
        .fill("tan")
        .animate(0, 1, new canvideo.Animation({ height: 120 }, { height: 80 })
            .reverse()
        )
    )
    .addShape(new canvideo.Rectangle(150, 200, 100, 25, 2)
        .fill("blue")
    )
    .addShape(new canvideo.Rectangle(150, 200, 50, 100, 1)
        .fill("blue")
        .stroke("navy", 10)
        .animate(0, 1, new canvideo.Animation({ height: 120 }, { height: 80 })
            .reverse()
        )
    )
    .addShape(new canvideo.Rectangle(200, 200, 50, 100, 1)
        .fill("blue")
        .stroke("navy", 20)
        .animate(0, 1, new canvideo.Animation({ height: 80 }, { height: 120 })
            .reverse()
        )
    );


//Brick wall
const wallLeft = 130;
const wallTop = 0;
const brickWidth = 40;
const brickHeight = 20;
const totalWidth = 140;
const totalHeight = 500;
var y = wallTop, odd = false;

while (y < totalHeight + wallTop) {
    odd = !odd;
    let x = wallLeft;
    let height = Math.min((totalHeight + wallTop) - y, brickHeight);
    if (odd) {
        keyFrame.addShape(new canvideo.Rectangle(x, y, brickWidth / 2, height)
            .fill("brown")
            .stroke("white", 25)
            .animate(0, 1, new canvideo.Animation({ y: y }, { y: y - 100 }))
        );
        x += brickWidth / 2;
    }
    while (x < totalWidth + wallLeft) {
        let width = Math.min((totalWidth + wallLeft) - x, brickWidth);

        keyFrame.addShape(new canvideo.Rectangle(x, y, width, height)
            .fill("brown")
            .stroke("white", 25)
            .animate(0, 1, new canvideo.Animation({ y: y }, { y: y - 100 }))
        );

        x += brickWidth;
    }
    y += brickHeight;
}

video.addKeyframe(keyFrame);
video.addKeyframe(new canvideo.Keyframe((24 * 0 + 23) / 24))
video.export(path.join(__dirname, "./res/output.mp4"));

video.on("done", () => {
    console.log("done")
});
video.on("error", () => {
    console.log("error!");
});