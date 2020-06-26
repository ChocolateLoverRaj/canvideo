import animator from "./animator";

declare interface Animation<Properties extends object> {
    startTime: number;
    duration: number;
    animator: animator<Properties>;
    isCalculator: boolean;
    isCustom: boolean;
}

declare interface Set<Properties extends object> {
    at: number;
    value: Properties
}

export declare interface AnimationJson {
    startTime: number;
    duration: number;
    isBuiltin: boolean;
    name: string | undefined;
    lasts: boolean;
    data: any;
}

export declare type SetJson<Properties> = [number, Properties];

declare abstract class Animations<Properties> extends Array<Animation<Properties>>{
    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): object;

    importJson(json: string, parse?: true): this;
    importJson(json: any, parse: false): this;
}

declare abstract class Sets<Properties> extends Array<Set<Properties>>{
    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): object;

    importJson(json: string, parse?: true): this;
    importJson(json: any, parse: false): this;
}

export declare abstract class Animanaged<T extends object, P extends object> {
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