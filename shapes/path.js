//Draw a path, similar to ctx path.

//Dependencies
const Shape = require("./shape");
const { Types, typedFunction, arrayOf } = require("../type");

//Path class
class Path extends Shape {
    name = "path";
    
    constructor(fill = false) {
        if (typeof fill === 'boolean') {
            super({
                strokeDash: {
                    initial: [],
                    type: arrayOf(Types.NON_NEGATIVE_NUMBER)
                },
                strokeDashOffset: Types.NUMBER
            });
            this.operations = [];
            this.doFill = fill;
        }
        else {
            throw new TypeError("fill must be boolean.");
        }
    }

    setStrokeDash(strokeDash) {
        this.strokeDash = strokeDash;
        return this;
    }
    setStrokeDashOffset(strokeDashOffset){
        this.strokeDashOffset = strokeDashOffset;
        return this;
    }

    moveTo(x, y) {
        typedFunction([{ name: "x", type: Types.NUMBER }, { name: "y", type: Types.NUMBER }], function (x, y) {
            this.operations.push(["moveTo", [x, y]]);
        }).call(this, x, y);
        return this;
    }
    lineTo(x, y) {
        typedFunction([{ name: "x", type: Types.NUMBER }, { name: "y", type: Types.NUMBER }], function (x, y) {
            this.operations.push(["lineTo", [x, y]]);
        }).call(this, x, y);
        return this;
    }
    arc() {
        typedFunction([
            { name: "x", type: Types.NUMBER },
            { name: "y", type: Types.NUMBER },
            { name: "radius", type: Types.NON_NEGATIVE_NUMBER },
            { name: "startAngle", type: Types.NUMBER },
            { name: "endAngle", type: Types.NUMBER },
            { name: "antiClockwise", type: Types.BOOLEAN, optional: true }
        ], function (x, y, radius, startAngle, endAngle, antiClockwise = false) {
            //Angles are in clock hour format (0 on top, 6 on bottom)
            //Convert clock hours to radians
            startAngle = (startAngle - 3) * Math.PI / 6;
            endAngle = (endAngle - 3) * Math.PI / 6;
            this.operations.push(["arc", [x, y, radius, startAngle, endAngle, antiClockwise]]);
        }).apply(this, arguments);
        return this;
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.setLineDash(this.strokeDash);
        ctx.lineDashOffset = this.strokeDashOffset

        ctx.beginPath();
        for (var i = 0; i < this.operations.length; i++) {
            let [method, args] = this.operations[i];
            ctx[method](...args);
        }
        if (this.doFill) {
            ctx.closePath();
            ctx.fill();
        }
        if (this.strokeWidth > 0) {
            ctx.stroke();
        }

        return this;
    }
}

//Export the Path class
module.exports = Path;