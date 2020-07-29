import animator from "./animator";

interface Animation<Properties extends object> {
    startTime: number;
    duration: number;
    animator: animator<Properties>;
    isCalculator: boolean;
    isCustom: boolean;
}

interface Set<Properties extends object> {
    at: number;
    value: Properties
}

export interface AnimationJson {
    startTime: number;
    duration: number;
    isBuiltin: boolean;
    name: string | undefined;
    lasts: boolean;
    data: any;
}

export interface SetJson<Properties> {
    at: number;
    value: Properties;
}

type fromJson<Properties extends {}> = (json?: any & object, parse?: any & false, throwErrors?: any & true) => animator<Properties>;
export type caMappings<Properties> = Map<string, fromJson<Properties>>;

export abstract class Animations<Properties extends {}> extends Array<Animation<Properties>>{
    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): object;

    importJson(json: string, parse?: true, caMappings?: caMappings<Properties>): this;
    importJson(json: any, parse: false, caMappings?: caMappings<Properties>): this;
}

export abstract class Sets<Properties extends {}> extends Array<Set<Properties>>{
    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): object;

    importJson(json: string, parse?: true): this;
    importJson(json: any, parse: false): this;
}

export abstract class Animanaged<T extends object, P extends object> {
    animations: Animations<P>;
    sets: Sets<P>;

    isExplicitlySet(key: string): boolean;
    animate(startTime: number, duration: number, animator: animator<P>): this;
    set(at: number, value: P): this;
    at(progress: number): T;

    propertyToJson(property: string | number, stringify?: true): string;
    propertyToJson(property: string | number, stringify: false): any;
}

export default Animanaged;