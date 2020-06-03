//File for creating rectangle class

//Dependencies
const Shape = require("./shape");
const { Types } = require("../type");

//Rectangle class
class Rectangle extends Shape {
    constructor(x, y, width, height) {
        super({
            x: Types.NUMBER,
            y: Types.NUMBER,
            width: Types.NUMBER,
            height: Types.NUMBER
        }, []);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.strokeWidth > 0) {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        return this;
    }
}

//Export the module
module.exports = Rectangle;