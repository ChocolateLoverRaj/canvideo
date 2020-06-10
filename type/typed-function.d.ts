import type = require("./type");

declare interface Arg {
    type: type;
    name: string;
    optional?: boolean;
    default?: any;
}

declare function typedFunction(args: Array<Arg>, f: Function): Function;

export = typedFunction;