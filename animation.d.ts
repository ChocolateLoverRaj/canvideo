import calculator = require("./properties/animanage/calculator");

declare interface Value {
    [key: string | number]: Value | number;
}

export default class Animation {
    constructor(startValue: Value, endValue: Value);

    readonly calculator: calculator<Value>;

    last(): this;
    reverse(): this;
    getCalculator(): calculator<Value>;
}