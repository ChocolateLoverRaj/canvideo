//Draws a moving truck in two angles

//Dependencies
const { Video, Scene, Rectangle, Group, Circle, Animation } = require("../index");

function wheel(cx, cy) {
    return new Group()
        .add(new Circle(cx, cy, 50)
            .fill("black")
        )
        .add(new Circle(cx, cy, 40)
            .fill("transparent")
            .stroke("white", 10)
        );
}

new Video(600, 400, 60)
    .setTempPath("../generated/")
    .add(new Scene()
        .add(0, 5, new Rectangle(0, 250, 600, 350)
            .fill("yellow")
        )
        .add(0, 5, new Group(-600, 0)
            .fill("red")
            .add(new Rectangle(100, 100, 300, 200))
            .add(new Rectangle(400, 200, 100, 100))
            .add(wheel(400, 300))
            .add(wheel(200, 300))
            .animate(0, 5, new Animation({ x: -600 }, { x: 600 }).getCalculator())
        )
    )
    .export("../generated/truck.mp4", { keepImages: false }, videoExport => {
        videoExport.on("finish", () => {
            console.log("done making truck video.");
        })
            .on("step_finish", step => {
                console.log("finished step", step);
            });
    });