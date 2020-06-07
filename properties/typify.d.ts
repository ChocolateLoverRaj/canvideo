import property from "./property";

declare interface Properties{
    [key: string]: property;
}

declare function typify(o: Object, properties: Properties): void;

export = typify;