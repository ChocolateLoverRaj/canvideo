import Animanaged = require("../properties/animanage/animanaged");

declare class Camera extends Animanaged<Camera> {
    constructor();

    scaleX: number;
    scaleY: number;
    refX: number;
    refY: number;
    x: number;
    y: number;

    setScaleX(x: number): this;
    setScaleY(y: number): this;
    setScale(x: number, y: number): this;

    setRefX(x: number): this;
    setRefY(y: number): this;
    setRef(x: number, y: number): this;

    setX(x: number): this;
    setY(y: number): this;
    setPosition(x: number, y: number): this;
}

export = Camera;