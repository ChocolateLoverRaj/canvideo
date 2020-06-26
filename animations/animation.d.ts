import { Animator } from "./animator";

declare interface Value {
    [key: string | number]: Value | number;
}

declare interface AnimationJson{
    startValue: Value;
    endValue: Value;
    reversed: boolean;
}

declare class Animation<Properties extends object> implements Animator<Properties> {
    static animationName: "animation";
    
    static fromJson(json: string, parse?: true, throwErrors?: false): Animation<any> | false;
    static fromJson(json: any, parse: false, throwErrors?: false): Animation<any> | false;
    static fromJson(json: string, parse?: true, throwErrors: true): Animation<any>;
    static fromJson(json: any, parse: false, throwErrors: true): Animation<any>;
    
    constructor(startValue: Value, endValue: Value);

    animationName: "animation";
    lasts: boolean;
    reversed: boolean;

    calculate(progress: number): Properties;
    last(): this;
    reverse(): this;

    toJson(stringify?: true): string;
    toJson(stringify: false): AnimationJson;
}

export = Animation;