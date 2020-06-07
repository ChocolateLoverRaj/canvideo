//Camera for scenes

//Dependencies
const { Types, Interface } = require("../type");
const { animanage } = require("../properties/animanage");

//Camera interface
const cameraInterface = new Interface(true)
    .required("scaleX", Types.NUMBER)
    .required("scaleY", Types.NUMBER)
    .required("refX", Types.NUMBER)
    .required("refY", Types.NUMBER)
    .required("x", Types.NUMBER)
    .required("y", Types.NUMBER)
    .toType();

//Camera class
class Camera {
    constructor() {
        animanage(this, {
            scaleX: Types.NUMBER,
            scaleY: Types.NUMBER,
            refX: Types.NUMBER,
            refY: Types.NUMBER,
            x: Types.NUMBER,
            y: Types.NUMBER,
        }, []);

        this.scaleX = 1;
        this.scaleY = 1;
        this.refX = 0;
        this.refY = 0;
        this.x = 0;
        this.y = 0;
    }

    setScaleX(x) {
        this.scaleX = x;
        return this;
    }
    setScaleY(y) {
        this.scaleY = y;
        return this;
    }
    setScale(x, y) {
        this.scaleX = x, this.scaleY = y;
        return this;
    }

    setRefX(x) {
        this.refX = x;
        return this;
    }
    setRefY(y) {
        this.refY = y;
        return this;
    }
    setRef(x, y) {
        this.refX = x, this.refY = y;
        return this;
    }

    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.x = y;
        return this;
    }
    setPosition(x, y) {
        this.x = x, this.y = y;
        return this;
    }
}

//Export the module
module.exports = { cameraInterface, Camera };