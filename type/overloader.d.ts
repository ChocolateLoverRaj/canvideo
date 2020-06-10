import type = require("./type");

declare interface OverloadArg {
    type: type;
    optional?: boolean;
}

declare interface Overload {
    maxLength: number;
    minLength: number;
    args: Array<OverloadArg>;
}

declare class Overloader {
    constructor();

    overloads: Array<Overload>;
    overloader: Function;

    overload(args: Array<OverloadArg>, f: Function): this;
}

export = Overloader;