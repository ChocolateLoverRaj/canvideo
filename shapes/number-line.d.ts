import Shape from "./shape";

export default class NumberLine extends Shape<NumberLine>{
    constructor(startNumber: number, endNumber: number, x: number, y: number, width: number, height: number);

    startNumber: number;
    endNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;

    setX(x: number): this;
    setY(y: number): this;
    setPosition(x: number, y: number): this;
    setPosition(position: { x: number, y: number }): this;
    setPosition(position: [number, number]): this;

    coordinateAt(n: number): { x: number, y: number };
}