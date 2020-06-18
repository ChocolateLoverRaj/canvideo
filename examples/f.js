//Parse and stringify videos to JSON

const fs = require('fs');
const { Video, Scene, Rectangle, Animation } = require("../index");

var video = new Video(400, 400, 12)
    .add(new Scene()
        .add(0, 5, new Rectangle(0, 0, 200, 200)
            .fill("red")
            .animate(1, 3, new Animation({ x: 0, y: 0, width: 200, height: 200 }, { x: 100, y: 100, width: 150, height: 150 })
                .getCalculator()
            )
        )
    );

fs.writeFileSync("./f.json", video.toJson());