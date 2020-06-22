//Draw circles

//Dependencies
const Shape = require("./shape");
const { Types, arrayOf, Overloader } = require("../type");
const pointInterface = require("./point-interface");

//Circle class
class Circle extends Shape {
    name = "circle";
    
    constructor(cx, cy, r) {
        super({
            cx: Types.NUMBER,
            cy: Types.NUMBER,
            r: Types.POSITIVE_NUMBER
        });

        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    setCx(cx) {
        this.cx = cx;
        return this;
    }
    setCy(cy) {
        this.cy = cy;
        return this;
    }
    setC() {
        new Overloader()
            .overload([{ type: Types.NUMBER }, { type: Types.NUMBER }], function (x, y) {
                this.cx = x, this.cy = y;
            })
            .overload([{ type: pointInterface }], function ({ x, y }) {
                this.cx = x, this.cy = y;
            })
            .overload([{ type: arrayOf(Types.NUMBER, 2) }], function ([x, y]) {
                this.cx = x, this.cy = y;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        if (this.strokeWidth > 0) {
            ctx.stroke();
        }

        return this;
    }

    toJson(stringify = true, fps = 60){
        let o = {
            ...super.toJson(false, fps),
            cx: this.cx,
            cy: this.cy,
            r: this.r
        };
        if(stringify === true){
            return JSON.stringify(o);
        }
        else if(stringify === false){
            return o;
        }
        else{
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

//Export the class
module.exports = Circle;