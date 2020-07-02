//Create groups of things

//Dependencies
const Shape = require("./shape");
const Circle = require("./circle");
const NumberLine = require("./number-line");
const Path = require("./path");
const Polygon = require("./polygon");
const Rectangle = require("./rectangle");
const { arrayOf, Types, Overloader, Interface, typedFunction, instanceOf } = require("../type");
const shapeInterface = require("./shape-interface");
const pointInterface = require("./point-interface");

//Size interface
const sizeInterface = new Interface(false)
    .required("width", Types.POSITIVE_NUMBER)
    .required("height", Types.POSITIVE_NUMBER)
    .toType();

//Check if a shape is builtin
//This is because requiring ./shapes.js will cause circular dependencies
const isBuiltin = a => {
    for (let shape of shapesList) {
        if (Object.getPrototypeOf(a) === shape.prototype) {
            return true;
        }
    }
    return false;
}

//Group class
class Group extends Shape {
    static shapeName = "group";
    shapeName = "group";

    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true },
        { name: "csMappings", type: instanceOf(Map), optional: true },
        { name: "caMappings", type: instanceOf(Map), optional: true }
    ], function (json, parse = true, throwErrors = false, csMappings = new Map(), caMappings = new Map()) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let [group, {
                x, y,
                originalWidth, originalHeight,
                refX, refY,
                width, height,
                children }] = Shape.fromJson(json, false, true, csMappings, new Group());
            group.x = x, group.y = y;
            group.originalWidth = originalWidth, group.originalHeight = originalHeight;
            group.refX = refX, group.refY = refY;
            group.width = width, group.height = height;
            for (let { isBuiltin, name, data } of children) {
                if (isBuiltin) {
                    var addedChild = false;
                    for (let shape of shapesList) {
                        if (name === shape.shapeName) {
                            switch (name) {
                                case Group.shapeName:
                                    group.add(shape.fromJson(data, false, true, csMappings, caMappings));
                                    break;
                                default:
                                    group.add(shape.fromJson(data, false, true, caMappings));
                                    break;
                            }
                            addedChild = true;
                            break;
                        }
                    }
                    if (!addedChild) {
                        throw new TypeError(`No builtin shape with name: ${name}.`);
                    }
                }
                else {
                    if (csMapping.has(name)) {
                        group.add(csMapping.get(name).fromJson(data, false, true));
                    }
                    else {
                        throw new TypeError(`No custom shape mappings for name: ${name}.`);
                    }
                }
            }
            return group;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    });

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
        });

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
            .overload([{ type: Types.POSITIVE_NUMBER }, { type: Types.POSITIVE_NUMBER }], function (width, height) {
                this.originalWidth = width;
                this.originalHeight = height;
            })
            .overload([{ type: sizeInterface }], function ({ width, height }) {
                this.originalWidth = width;
                this.originalHeight = height;
            })
            .overload([{ type: arrayOf(Types.POSITIVE_NUMBER, 2) }], function ([width, height]) {
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
            .overload([{ type: Types.POSITIVE_NUMBER }, { type: Types.POSITIVE_NUMBER }], function (width, height) {
                this.width = width;
                this.height = height;
            })
            .overload([{ type: sizeInterface }], function ({ width, height }) {
                this.width = width;
                this.height = height;
            })
            .overload([{ type: arrayOf(Types.POSITIVE_NUMBER, 2) }], function ([width, height]) {
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

            //Call the child's draw function
            this.children[i].at(ctx.now).draw(ctx);

            //Undo transformations
            ctx.scale(1 / scaleX, 1 / scaleY);
            ctx.translate(-scaleTranslate[0], -scaleTranslate[1]);
            ctx.translate(-this.x, -this.y);
        }
        return this;
    }

    toJson(stringify = true, fps = 60) {
        let o = {
            ...super.toJson(false, fps),
            x: this.x,
            y: this.y,
            originalWidth: this.originalWidth,
            originalHeight: this.originalHeight,
            width: this.width,
            height: this.height,
            refX: this.refX,
            refY: this.refY,
            children: []
        };
        for (var i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            o.children.push({
                isBuiltin: isBuiltin(child),
                name: child.shapeName,
                data: this.children[i].toJson(false, fps)
            });
        }
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
};

//List of shapes
const shapesList = [Shape, Circle, NumberLine, Path, Polygon, Rectangle, Group];

//Export the group class
module.exports = Group;