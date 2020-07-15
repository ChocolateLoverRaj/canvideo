const { Video, Scene, Rectangle } = require("../index");

const tinyColor = require('tinycolor2');

const w = 2;
const h = 2;
const size = 200;
const fps = 1;

const hueInc = 360 / (w * h);
let hue = 0;

const s = new Scene().setDuration(w * h / fps);

const availRows = new Map();
for (let i = 0; i < h; i++) {
    let availColumns = new Set();
    for (let j = 0; j < w; j++) {
        availColumns.add(j);
    }
    availRows.set(i, availColumns);
}

for (let f = 0; f < w * h; f++, hue += hueInc) {
    let rows = [...availRows.keys()];
    let row = rows[Math.floor(Math.random() * rows.length)];
    let columnsSet = availRows.get(row);
    let columns = [...columnsSet];
    let column = columns[Math.floor(Math.random() * columns.length)];
    columnsSet.delete(column);
    if (columnsSet.size === 0) {
        availRows.delete(row);
    }
    s.add(f / fps, new Rectangle(column * size, row * size, size, size)
        .fill(new tinyColor({ h: hue, s: 100, l: 50 }).toHexString())
    )
}

console.time("create");
console.log("creating");

new Video(w * size, h * size, fps)
    .add(s)
    .setTempPath("../generated")
    .fExport("../generated/f.mp4", { keepImages: false }, true).then(() => {
        console.timeEnd("create");
    });