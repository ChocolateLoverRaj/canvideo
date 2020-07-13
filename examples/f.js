const { Video, Scene, Rectangle } = require("../index");

new Video(400, 400, 2)
    .add(new Scene()
        .add(0, 2, new Rectangle(0, 0, 200, 200)
            .set(1, {
                x: 100,
                y: 100
            })
        )
    )
    .add(new Scene()
        .add(0, 2, new Rectangle(0, 0, 200, 200)
            .fill("red")
        )
    )
    .setTempPath("../generated")
    .fExport("../generated/f.mp4", { keepImages: true });