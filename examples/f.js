//Parse and stringify videos to JSON
//Purpose of this file: Demonstrate the ability to convert Video class to JSON format. 
//This is useful for exporting the instructions on how to make the video, not the video itself.
//Then you can parse json to get a Video instance.

//Dependencies
const fs = require('fs');
//'../index' is used because this example is in the canvideo folder. Change it to 'canvideo';
const { Video, Scene, Rectangle, Animation, Polygon, Circle, Group, Shape, Camera } = require("../index");

//This shows how custom classes can also be saved and imported to and from JSON.
//Here we have a simple class that is basically a shape class that saves some sort of data.
class Stuff extends Shape {
    shapeName = "stuff";

    static fromJson(json, parse, throwErrors, caMappings) {
        var [cs, { stuff }] = super.fromJson(json, parse, throwErrors, caMappings,   new Stuff(""));
        cs.stuff = stuff;
        return cs;
    }

    constructor(stuff) {
        super();
        this.stuff = stuff;
    }

    toJson(stringify, fps) {
        let o = super.toJson(false, fps);
        o.stuff = this.stuff;
        if (stringify) {
            return JSON.stringify(o);
        }
        else {
            return o;
        }
    }
}

//You can also make custom animations that turn their data to and from JSON.
//This could be preferred over animator functions, because animator function get implicitly converted to Precomputed.
//This is because saving functions as JSON is dangerous.
//For this no data is stored, so the toJson function can return undefined.
const randomColor = {
    calculate: () => ({
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    }),
    animationName: "randomColor",
    toJson: () => undefined
};

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
            .animate(0, 10, randomColor)
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
        .add(0, 10, new Stuff("Hello, who is this?"))
        .setCamera(new Camera()
            .setPosition(100, 200)
        )
    );

//Export to JSON and write to file.
fs.writeFileSync("./f.json", video.toJson());

//Read JSON
var read = fs.readFileSync("./f.json", "utf-8");

//fromJson is a static method in the Video class that returns a Video.

//The second last argument is csMappings, which stands for custom shape mappings.
//It is a map where the keys are names and values are the fromJson functions.
var csMappings = new Map().set("stuff", Stuff.fromJson);

//The last argument is caMappings, which stands for custom animation mappings.
//It is a map where the keys are names and the values are fromJson functions.
//Here we add a key called 'randomColor', which is a function that returns randomColor.
//This is because randomColor has no data, and only the animation name is needed.
var caMappings = new Map().set("randomColor", () => randomColor);

var videoFromJson = Video.fromJson(read, true, true, csMappings, caMappings);

//This compares the parsed, stringified Video to the original Video JSON.
//Both of the strings should be equal, meaning that no data is lost.
console.log(videoFromJson.toJson() === read);