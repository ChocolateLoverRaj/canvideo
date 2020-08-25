//This example demonstrates how to add captions to videos.
import { Video, Scene, Rectangle, Caption } from "../index.js";

new Video(400, 400, 24)
    .add(new Scene()
        .add(0, 5, new Rectangle(0, 0, 200, 200)
            .fill("red")
        )
        //You can add captions by using the Caption class
        .add(new Caption()
            .add(1, 4, "Hello.")
        )
        //You can specify the id of the caption. In this case, it's 'spanish'.
        //If you don't specify it, there will be an automatic id for it.
        .add("spanish", new Caption()
            .add(1, 4, "Hola.")
        )
    )
    .add(new Scene()
        .add(0, 5, new Rectangle(100, 100, 200, 200)
            .fill("orange")
        )
        //If you have captions in multiple scenes, captions with the same id will be joined.
        .add(new Caption()
            .add(0, 2, "The end.")
        )
        //This works on as many captions as you want.
        .add("spanish", new Caption()
            .add(0, 2, "El fine.")
        )
    )
    .setTempPath("../generated")
    .export({
        //You can specify multiple options for exporting.
        //The video is where the mp4 video will be saved.
        //Note: only .mp4 videos are allowed.
        video: "../generated/captions.mp4",
        //EmbeddedCaptions can be a boolean or a Set.
        //If it's a boolean, false will mean no embeddedCaptions,
        //and true will embed all captions.
        //If you use a Set() then you can specify the set of ids you want to embed
        embeddedCaptions: true,
        //There is also an option for saving the captions instead of deleting.
        //after the video is generated.
        //It can be a string (of a directory), or a Map.
        //To not save captions, just don't include the property or have it undefined.
        //To save all captions in a folder, just pass a string.
        //To save specific ids in specific files, specify a Map.
        //The key is the id and the value is the file to save it.
        //Note: only .vtt captions are allowed.
    });