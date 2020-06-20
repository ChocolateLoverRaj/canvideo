import { Animator } from "./animator";

declare class Precomputed implements Animator<object> {
    constructor(values: Array<[number, object]>);

    lasts: boolean;

    calculate(progress: number): object;
}

export = Precomputed;