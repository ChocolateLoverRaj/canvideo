//Draws a moving truck in two angles

//Dependencies
import { Video, Scene, Rectangle, Group, Circle, Animation, Polygon } from 'canvideo';

function wheel(cx, cy) {
    return new Group()
        .add(new Circle(cx, cy, 50)
            .fill("gray")
        )
        .add(new Circle(cx, cy, 40)
            .fill("transparent")
            .stroke("white", 10)
        );
}

new Video(600, 400, 60)
    .setTempPath("../generated/")
    .add(new Scene()
        .setBackgroundColor("skyBlue")
        .add(0, 5, new Rectangle(0, 250, 600, 350)
            .fill("yellow")
        )
        .add(0, 5, new Group(-600, 0)
            .fill("red")
            .add(new Rectangle(100, 100, 300, 200))
            .add(new Rectangle(400, 200, 100, 100))
            .add(wheel(400, 300))
            .add(wheel(200, 300))
            .animate(0, 5, new Animation({ x: -600 }, { x: 600 }))
        )
    )
    .add(new Scene()
        .setBackgroundColor("skyBlue")
        .add(0, 5, new Rectangle(0, 200, 600, 200)
            .fill("yellow")
        )
        .add(0, 5, new Group()
            .add(new Polygon(300, 200, 100, 400, 500, 400)
                .fill("black")
            )
            .add(new Group()
                .add(new Polygon(300, 200, 275, 400, 287.5, 400))
                .add(new Polygon(300, 200, 312.5, 400, 325, 400))
                .fill("yellow")
            )
        )
        .add(0, 5, new Group(350, 310, 100, 125, 0, 0)
            .add(new Rectangle(0, 0, 100, 100)
                .fill("red")
            )
            .add(new Group()
                .add(new Rectangle(15, 100, 15, 15)
                    .setBottomCornerRound(5)
                )
                .add(new Rectangle(70, 100, 15, 15)
                    .setBottomCornerRound(5)
                )
                .fill("gray")
            )
            .animate(0, 5, new Animation(
                { x: 350, y: 310, width: 100, height: 125 },
                { x: 300, y: 200, width: 0, height: 0 }
            ))
        )
    )
    .export("../generated/truck.mp4", { keepImages: false }, videoExport => {
        videoExport
            .on("finish", () => {
                console.log("done making truck video.");
            })
            .on("step_finish", step => {
                console.log("finished step", step);
            });
    });