//Draws graph with the recaman sequence visualization.

//Dependencies
import { Video, Scene, Animation, NumberLine, Path, Camera } from 'canvideo';

//You can adjust theses
const numberCount = 300;
const secondsPerNumber = 1;
const strokeWidth = 100;
const minH = 0;
const maxH = 360;
const hIncrement = 10;

var numberLine = new NumberLine(0, 1, 100, 500, 800, 25)
    .stroke("white", 3)
    .fill("white");
const totalDuration = numberCount * secondsPerNumber;
var recaman = new Scene()
    .setBackgroundColor("black")
    .add(0, numberLine)
    .setDuration(totalDuration);

//Go through the recaman sequence
//Note: Sequence is a Set() for performance reasons and will be inaccurate after calculating.
var sequence = new Set().add(0);
var h = minH;
var hIncPositive = true;
for (var last = 0, i = 0, increment = 1, under = true; i < numberCount - 1; i++, increment++, under = !under) {
    let before = last;
    let preference = last - increment;
    var startAngle, endAngle, antiClockwise;
    if (preference > 0 && !sequence.has(preference)) {
        last = preference;
        startAngle = 3, endAngle = 9, antiClockwise = !under;
    }
    else {
        last += increment;
        startAngle = 9, endAngle = 3, antiClockwise = under;
    }
    sequence.add(last);

    let s = i * secondsPerNumber;
    let numberLineAtTime = numberLine.at(s);
    let beforeCoordinate = numberLineAtTime.coordinateAt(before);
    let halfMove = (numberLineAtTime.coordinateAt(last).x - beforeCoordinate.x) / 2;
    let radius = Math.abs(halfMove);
    let pathLength = radius * Math.PI;
    recaman.add(s, new Path(false)
        .moveTo(beforeCoordinate.x, beforeCoordinate.y)
        .arc(beforeCoordinate.x + halfMove, beforeCoordinate.y, radius, startAngle, endAngle, antiClockwise)
        .stroke(`hsl(${h}, 100%, 50%)`, strokeWidth)
        .setStrokeDash([pathLength])
        .animate(s, secondsPerNumber, new Animation(
            {
                strokeDashOffset: pathLength
            },
            {
                strokeDashOffset: 0
            }
        )
            .last()
            .getCalculator()
        )
    );
    for(var j = 0; j < hIncrement; j++){
        if(hIncPositive){
            h++;
        }
        else{
            h--;
        }
        if(h === minH || h === maxH){
            hIncPositive = !hIncPositive;
        }
    }
}
var maxNumber = Math.max(...sequence);
numberLine.animate(0, totalDuration, new Animation(
    {
        endNumber: 1,
        strokeWidth: 3,
        width: 800,
        height: 100
    },
    {
        endNumber: maxNumber,
        strokeWidth: 3 * maxNumber,
        width: 800 * maxNumber,
        height: 100 * maxNumber
    }
).getCalculator());
recaman.setCamera(new Camera()
    .setRef(100, 500)
    .animate(0, totalDuration, function (progress) {
        var wantedWidth = 800 + (800 * (maxNumber - 1)) * progress;
        var scale = 800 / wantedWidth;
        return {
            scaleX: scale,
            scaleY: scale
        };
    })
);

console.log("starting");
new Video(1000, 1000, 60)
    .add(recaman)
    .setTempPath("../generated/")
    .export("../generated/recaman.mp4", { keepImages: true })
    .on("frame_progress", ({ count, total, progress }) => {
        progress = Math.round(progress * 1000) / 1000;
        console.log(count, "out of", total, "frames", progress, process.memoryUsage().heapUsed / 1024 ** 2, "MB");
    })
    .on("step_finish", step => {
        console.log("Step finished:", step);
    })
    .once("finish", () => {
        console.log("done");
    });