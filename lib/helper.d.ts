namespace helper {
    export function recursiveAssign(target: object, source: object): object;

    export class ExtendibleFunction {
        action: (...args: Array<any>) => void;
    }
}

export = helper;