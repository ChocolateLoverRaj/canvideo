import { Animator } from "./animator";

type values = Array<[number, object]>;

declare class Precomputed implements Animator<object> {
    static animationName: "precomputed";

    static fromJson(json: string, parse?: true, throwErrors?: false): Precomputed | false;
    static fromJson(json: any, parse: false, throwErrors?: false): Precomputed | false;
    static fromJson(json: string, parse?: true, throwErrors: true): Precomputed;
    static fromJson(json: any, parse: false, throwErrors: true): Precomputed;

    constructor(values: values);

    animationName: "precomputed";
    lasts: boolean;

    calculate(progress: number): object;

    toJson(stringify?: true): string;
    toJson(stringify: false): values;
}

export default Precomputed;