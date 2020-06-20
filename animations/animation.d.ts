import { Animator } from "./animator";

declare interface Value {
    [key: string | number]: Value | number;
}

declare class Animation<Properties extends object> implements Animator<Properties> {
    constructor(startValue: Value, endValue: Value);

    name: "animation";
    lasts: boolean;
    reversed: boolean;

    calculate(progress: number): Properties;
    last(): this;
    reverse(): this;
}

export = Animation;