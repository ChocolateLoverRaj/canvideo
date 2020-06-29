//Camera for scenes

//Dependencies
const { Types, typedFunction } = require("../type");
const { animanage } = require("../animations/animanage");

//Camera class
class Camera {
    static fromJson = typedFunction([
        { name: "json", type: Types.ANY },
        { name: "parse", type: Types.BOOLEAN, optional: true },
        { name: "throwErrors", type: Types.BOOLEAN, optional: true }
    ], function (json, parse = true, throwErrors = false) {
        try {
            if (parse) {
                json = JSON.parse(json);
            }
            let { scaleX, scaleY, refX, refY, x, y } = json;
            return new Camera()
                .setScale(scaleX, scaleY)
                .setRef(refX, refY)
                .setPosition(x, y);
        }
        catch(e){
            if(throwErrors){
                throw e;
            }
            else{
                return false;
            }
        }
    });

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

    toJson(stringify = true) {
        let { scaleX, scaleY, refX, refY, x, y } = this;
        let o = { scaleX, scaleY, refX, refY, x, y };
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
}

//Export the module
module.exports = Camera;