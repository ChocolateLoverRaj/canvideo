//Customizable number line shape

//Dependencies
const Shape = require("./shape");
const { Overloader, Types, arrayOf } = require("../type");
const pointInterface = require("./point-interface");

//Number line class
class NumberLine extends Shape {
    constructor(startNumber, endNumber, x, y, width, height) {
        super({
            startNumber: Types.NUMBER,
            endNumber: Types.NUMBER,
            x: Types.NUMBER,
            y: Types.NUMBER,
            width: Types.POSITIVE_NUMBER,
            height: Types.POSITIVE_NUMBER
        }, ["coordinateAt"]);
        this.startNumber = startNumber;
        this.endNumber = endNumber;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setPosition() {
        new Overloader()
            .overload([{ type: Types.NUMBER }, { type: Types.NUMBER }], function (x, y) {
                this.x = x, this.y = y;
            })
            .overload([{ type: pointInterface }], function ({ x, y }) {
                this.x = x, this.y = y;
            })
            .overload([{ type: arrayOf(Types.NUMBER, 2) }], function ([x, y]) {
                this.x = x, this.y = y;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    coordinateAt(n) {
        var intRatio = this.width / (this.endNumber - this.startNumber);
        return {
            x: this.x + n * intRatio,
            y: this.y
        };
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.beginPath();

        //Horizontal line
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);

        //Two ends
        var halfHeight = this.height / 2;
        ctx.moveTo(this.x, this.y - halfHeight);
        ctx.lineTo(this.x, this.y + halfHeight);
        ctx.moveTo(this.x + this.width, this.y - halfHeight);
        ctx.lineTo(this.x + this.width, this.y + halfHeight);

        //Draw at every integer
        ctx.font = `${this.height}px Sans-serif`;
        var maxDigits = Math.floor(this.endNumber).toString().length;
        var maxWidth = ctx.measureText("0".repeat(maxDigits)).width;
        var intRatio = this.width / (this.endNumber - this.startNumber);
        var interval = Math.ceil(((this.endNumber - this.startNumber) * maxWidth * 2) / this.width);
        for (var i = Math.ceil(this.startNumber); i <= Math.floor(this.endNumber); i += interval) {
            ctx.moveTo(this.x + i * intRatio, this.y - halfHeight);
            ctx.lineTo(this.x + i * intRatio, this.y + halfHeight);
            let intWidth = ctx.measureText(i.toString()).width;
            ctx.fillText(i.toString(), this.x + i * intRatio - intWidth / 2, this.y + this.height * 1.5);
        }

        ctx.closePath();
        ctx.stroke();

        return this;
    }
}

//Export the class
module.exports = NumberLine;