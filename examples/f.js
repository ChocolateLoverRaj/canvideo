const { Video, Scene, Rectangle } = require("../index");

new Video(400, 400, 2)
    .add(new Scene()
        .add(0, 2, new Rectangle(0, 0, 200, 200))
    )
    .setTempPath("../generated")
    .fExport("../generated/f.mp4", { keepImages: true });