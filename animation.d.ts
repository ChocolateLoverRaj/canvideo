declare interface Value {
    [key: string | number]: Value | number;
}

declare class Animation{
    constructor(startValue: Value, endValue: Value);

    readonly calculate: (progress: number) => Value;
}

export = Animation;