import calculator = require("./animanage/calculator");

declare interface Value {
    [key: string | number]: Value | number;
}

declare class Animation{
    constructor(startValue: Value, endValue: Value);

    readonly calculator: calculator<Value>;

    last(): this;
    reverse(): this;
    getCalculator(): calculator<Value>;
}

export = Animation;