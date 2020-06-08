//Create groups of things

//Dependencies
const Shape = require("./shape");
const { arrayOf, Types, Overloader } = require("../type");
const shapeInterface = require("./shape-interface");
const pointInterface = require("./point-interface");

//Group class
class Group extends Shape {
    constructor(x = 0, y = 0) {
        super({
            children: {
                initial: [],
                type: arrayOf(shapeInterface)
            },
            x: Types.NUMBER,
            y: Types.NUMBER
        }, []);

        this.x = x;
        this.y = y;
    }

    setX(x){
        this.x = x;
        return this;
    }
    setY(y){
        this.y = y;
        return this;
    }
    setPosition(){
        new Overloader()
        .overload([{type: Types.NUMBER}, {type: Types.NUMBER}], function(x, y){
            this.x = x, this.y = y;
        })
        .overload([{type: pointInterface}], function({x, y}){
            this.x = x, this.y = y;
        })
        .overload([{type: arrayOf(Types.NUMBER, 2)}], function([x, y]){
            this.x = x, this.y = y;
        })
        .overloader.apply(this, arguments);
        return this;
    }

    add(shape) {
        this.children.push(shape);
        return this;
    }

    draw(ctx) {
        for (var i = 0; i < this.children.length; i++) {
            super.draw(ctx);

            ctx.translate(this.x, this.y);

            let child = this.children[i];
            if (typeof child.draw === 'function') {
                this.children[i].draw(ctx);
            }
            else {
                throw new TypeError("Drawable must have draw function.");
            }

            ctx.translate(-this.x, -this.y);
        }
        return this;
    }
};

//Export the group class
module.exports = Group;