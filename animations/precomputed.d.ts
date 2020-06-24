import { Animator } from "./animator";

declare class Precomputed implements Animator<object> {    
    static animationName: "precomputed";
    
    constructor(values: Array<[number, object]>);
    
    animationName: "precomputed";
    lasts: boolean;

    calculate(progress: number): object;
}

export = Precomputed;