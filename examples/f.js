//Parse and stringify videos to JSON

const fs = require('fs');
const { Video, Scene, Rectangle, Animation, Polygon, Circle, Group } = require("../index");

var video = new Video(400, 400, 12)
    .add(new Scene()
        .add(0, 5, new Rectangle(0, 0, 200, 200)
            .fill("red")
            .animate(1, 3, new Animation({ x: 0, y: 0, width: 200, height: 200 }, { x: 100, y: 100, width: 150, height: 150 })
                .last()
            )
        )
        .add(0, 10, new Polygon(300, 0, 400, 0, 400, 100)
            .fill("green")
            .animate(0, 10, function (progress) {
                var color = {
                    r: Math.floor(Math.random() * 256),
                    g: Math.floor(Math.random() * 256),
                    b: Math.floor(Math.random() * 256)
                }
                return {
                    fillColor: color
                };
            })
        )
        .add(4, 2, new Group(200, 100)
            .fill("dodgerBlue")
            .add(new Circle(-100, 0, 25)
                .set(5, { r: 15 })
            )
            .add(new Circle(100, 0, 15)
                .set(5, { r: 25 })
            )
            .set(5, { y: 300 })
        )
    );

//fs.writeFileSync("./f.json", video.toJson());
//TODO explain what the purpose of this example file is.

var videoFromJson = Video.fromJson(fs.readFileSync("./f.json", "utf-8"), true, true);

console.log(videoFromJson.scenes[0].drawables[2].shape);