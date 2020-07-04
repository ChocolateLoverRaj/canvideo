const { Video, Scene, Rectangle, Caption } = require("../index");

const video = new Video(400, 400, 1)
    .add(new Scene()
        .add(0, 3, new Rectangle(0, 0, 200, 200)
            .fill("red")
        )
        .add(new Caption()
            .add(1, 4, "hello")
        )
        .add("spanish", new Caption()
            .add(1, 4, "Hola.")
        )
    )
    .setTempPath("../generated")
    .export("../generated/c.mp4", { keepImages: true }, videoExport => {
        let m = videoExport.deleteExtraFrames;

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

        m
            .on("deleteExtraFrames_start", () => {
                console.log("start");
            })
            .on("deleteExtraFrames_readDir", () => {
                console.log("readDir");
            })
            .on("deleteExtraFrames_deleteStart", (frameNumber) => {
                console.log("deleteStart", frameNumber);
            })
            .on("deleteExtraFrames_deleteFinish", (frameNumber) => {
                console.log("deleteFinish", frameNumber);
            })
            .on("deleteExtraFrames_finish", () => {
                console.log("finish");
            })
    });