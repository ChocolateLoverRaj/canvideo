import type from "./type";

interface OverloadArg {
    type: type;
    optional?: boolean;
}

interface Overload {
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

export default Overloader;