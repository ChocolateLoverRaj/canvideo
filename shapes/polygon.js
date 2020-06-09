//Draw polygons with any number of sides

//Dependencies
const Shape = require("./shape");
const { arrayOf } = require("../type");
const pointInterface = require("./point-interface");

//Polygon class
class Polygon extends Shape {
    constructor() {
        super({
            points: {
                type: arrayOf(pointInterface),
                initial: []
            }
        });
        switch (typeof arguments[0]) {
            case 'number':
                if (arguments.length & 1) {
                    throw new TypeError("Cannot have odd number of arguments in a list of x, y.");
                }
                else {
                    for (var i = 0; i < arguments.length; i += 2) {
                        if(typeof arguments[i] === 'number' && typeof arguments[i + 1] === 'number'){
                            this.points.push({
                                x: arguments[i],
                                y: arguments[i + 1]
                            });
                        }
                        else{
                            throw new TypeError("Bad list of x and ys.");
                        }
                    }
                }
                break;
            case 'object':
                if (arguments[0] instanceof Array) {
                    for(var i = 0; i < arguments.length; i++){
                        let arg = arguments[i];
                        if(arg instanceof Array && arg.length === 2){
                            if(typeof arg[0] === 'number' && typeof arg[1] === "number"){
                                this.points.push({
                                    x: arg[0],
                                    y: arg[1]
                                });
                            }
                            else{
                                throw new TypeError("Expected [number, number].");
                            }
                        }
                        else{
                            throw new TypeError("Expected all args to be an array of [x, y].");
                        }
                    }
                }
                else {
                    for(var i = 0; i < arguments.length; i++){
                        let arg = arguments[i];
                        let err = pointInterface(arg);
                        if(!err){
                            this.points.push(arg);
                        }
                        else{
                            throw new TypeError(`point ${i}: ${arg}, ${err}`);
                        }
                    }
                }
                break;
            case 'undefined':
                if (arguments.length > 0) {
                    throw new TypeError("First argument cannot be undefined.");
                }
                break;
            default:
                throw new TypeError("Invalid construction.");
        }
    }

    draw(ctx){
        super.draw(ctx);

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for(var i = 0; i < this.points.length; i++){
            let point = this.points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();
        if(this.strokeWidth > 0){
            ctx.stroke();
        }

        return this;
    }
}

//Export the polygon class
module.exports = Polygon;