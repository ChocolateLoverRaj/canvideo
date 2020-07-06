const { Video, Scene, Rectangle, Caption } = require("../index");

const video = new Video(400, 400, 24)
    .add(new Scene()
        .add(0, 5, new Rectangle(0, 0, 200, 200)
            .fill("red")
        )
        .add(new Caption()
            .add(1, 4, "hello")
        )
        .add("spanish", new Caption()
            .add(1, 4, "Hola.")
        )
    )
    .add(new Scene()
        .add(0, 5, new Rectangle(100, 100, 200, 200)
            .fill("orange")
        )
        .add(new Caption()
            .add(0, 2, "The End.")
        )
    )
    .setTempPath("../generated")
    .export({
        video: "../generated/c.mp4",
        embeddedCaptions: true,
    }, { keepImages: true }, videoExport => {
        let m = videoExport.renderNewFrames;

        videoExport
            .on("stage", stage => {
                console.log("stage", stage);
            })
            .on("taskStart", task => {
                console.log("taskStart", task.name);
            })
            .on("taskFinish", task => {
                console.log("taskFinish", task.name);
            });

        videoExport
            .on("generateSeparateCaptions_start", () => {
                console.log("start");
            })
            .on("generateSeparateCaptions_writeStart", (frameNumber) => {
                console.log("writeStart", frameNumber);
            })
            .on("generateSeparateCaptions_writeFinish", (frameNumber) => {
                console.log("writeFinish", frameNumber);
            })
            .on("generateSeparateCaptions_finish", () => {
                console.log("finish");
            })
    });