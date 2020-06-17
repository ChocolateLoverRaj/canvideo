import Shape from "./shape";

export default class Path extends Shape<Path>{
    constructor(fill?: boolean);

    operations: Array<[string, Array<string>]>;
    
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, antiClockwise?: boolean): this;
}