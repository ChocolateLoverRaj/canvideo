//Create groups of things

//Dependencies
const Shape = require("./shape");
const { arrayOf, Types, Overloader, Interface } = require("../type");
const shapeInterface = require("./shape-interface");
const pointInterface = require("./point-interface");

//Size interface
const sizeInterface = new Interface(false)
    .required("width", Types.POSITIVE_NUMBER)
    .required("height", Types.POSITIVE_NUMBER)
    .toType();

//Group class
class Group extends Shape {
    constructor(x = 0, y = 0, originalWidth = 400, originalHeight = 400, refX = 0, refY = 0) {
        super({
            children: {
                initial: [],
                type: arrayOf(shapeInterface)
            },
            x: Types.NUMBER,
            y: Types.NUMBER,
            originalWidth: Types.POSITIVE_NUMBER,
            originalHeight: Types.POSITIVE_NUMBER,
            refX: Types.NUMBER,
            refY: Types.NUMBER,
            width: Types.POSITIVE_NUMBER,
            height: Types.POSITIVE_NUMBER
        }, []);

        this.x = x;
        this.y = y;
        this.originalWidth = originalWidth;
        this.originalHeight = originalHeight;
        this.refX = refX;
        this.refY = refY;
        this.width = originalWidth;
        this.height = originalHeight;
    }

    setOriginalWidth(width) {
        this.originalWidth = width;
        return this;
    }
    setOriginalHeight(height) {
        this.originalHeight = height;
    }
    setOriginalSize() {
        new Overloader()
            .overload([{type: Types.POSITIVE_NUMBER}, {type: Types.POSITIVE_NUMBER}], function(width, height){
                this.originalWidth = width;
                this.originalHeight = height;
            })
            .overload([{type: sizeInterface}], function({width, height}){
                this.originalWidth = width;
                this.originalHeight = height;
            })
            .overload([{type: arrayOf(Types.POSITIVE_NUMBER, 2)}], function([width, height]){
                this.originalWidth = width;
                this.originalHeight = height;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    setWidth(width) {
        this.width = width;
        return this;
    }
    setHeight(height) {
        this.height = height;
    }
    setSize() {
        new Overloader()
            .overload([{type: Types.POSITIVE_NUMBER}, {type: Types.POSITIVE_NUMBER}], function(width, height){
                this.width = width;
                this.height = height;
            })
            .overload([{type: sizeInterface}], function({width, height}){
                this.width = width;
                this.height = height;
            })
            .overload([{type: arrayOf(Types.POSITIVE_NUMBER, 2)}], function([width, height]){
                this.width = width;
                this.height = height;
            })
            .overloader.apply(this, arguments);
        return this;
    }

    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.y = y;
        return this;
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

    setRefX(x) {
        this.refX = x;
        return this;
    }
    setRefY(y) {
        this.y = y;
        return this;
    }
    setRef() {
        new Overloader()
            .overload([{ type: Types.NUMBER }, { type: Types.NUMBER }], function (x, y) {
                this.refX = x, this.refY = y;
            })
            .overload([{ type: pointInterface }], function ({ x, y }) {
                this.refX = x, this.refY = y;
            })
            .overload([{ type: arrayOf(Types.NUMBER, 2) }], function ([x, y]) {
                this.refX = x, this.refY = y;
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

            //Translate and scale
            var scaleX = this.width / this.originalWidth;
            var scaleY = this.height / this.originalHeight;
            var scaleTranslate = [-(this.refX * (scaleX - 1)), -(this.refY * (scaleY - 1))];
            ctx.translate(this.x, this.y);
            ctx.translate(scaleTranslate[0], scaleTranslate[1]);
            ctx.scale(scaleX, scaleY);

            let child = this.children[i].at(ctx.now);
            if (typeof child.draw === 'function') {
                this.children[i].draw(ctx);
            }
            else {
                throw new TypeError("Drawable must have draw function.");
            }

            //Undo transformations
            ctx.scale(1 / scaleX, 1 / scaleY);
            ctx.translate(-scaleTranslate[0], -scaleTranslate[1]);
            ctx.translate(-this.x, -this.y);
        }
        return this;
    }
};

//Export the group class
module.exports = Group;