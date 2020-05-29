declare type type = (a: any) => false | string;

declare class PropertyManager {
    constructor(properties: { [key: string]: type });
}

export = PropertyManager;