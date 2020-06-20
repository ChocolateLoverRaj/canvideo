//Parse and stringify videos to JSON

const fs = require('fs');
const { Video, Scene, Rectangle, Animation, Polygon, Circle, Group, Precomputed } = require("../index");

var video = new Video(400, 400, 12)
    .add(new Scene()
        .add(0, 5, new Rectangle(0, 0, 200, 200)
            .fill("red")
            .animate(1, 3, new Animation({ x: 0, y: 0, width: 200, height: 200 }, { x: 100, y: 100, width: 150, height: 150 })
                .last()
            )
        )
        .add(0, 10, new Polygon(0, 0, 400, 0, 300, 200, 400, 400, 0, 400, 100, 200)
            .fill("green")
            .animate(0, 10, function (progress) {
                return {
                    fillColor: {
                        r: Math.floor(Math.random() * 256),
                        g: Math.floor(Math.random() * 256),
                        b: Math.floor(Math.random() * 256)
                    }
                };
            })
        )
        /*
        .add(4, 2, new Group(100, 200)
            .fill("white")
            .add(new Circle(-100, 0, 25)
                .set(5, { r: 15 })
            )
            .add(new Circle(100, 0, 15)
                .set(5, { r: 25 })
            )
            .set(5, { x: 300 })
        )*/
    );

video.setTempPath("../generated/").export("../generated/f.mp4", {keepImages: false});

fs.writeFileSync("./f.json", video.toJson());