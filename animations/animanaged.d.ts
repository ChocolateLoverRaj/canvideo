import animator from "./animator";

declare interface Animation<Properties extends object> {
    startTime: number;
    duration: number;
    animator: animator<Properties>;
    isCalculator: boolean;
    isCustom: boolean;
}

declare interface Set<Properties extends object>{
    at: number;
    value: Properties
}

declare abstract class Animanaged<T extends object> {
    animations: Array<Animation<T>>
    sets: Array<Set<T>>

    isExplicitlySet(key: string): boolean;
    animate(startTime: number, duration: number, animator: animator<T>): this;
    set(at: number, value: T): this;
    at(progress: number): T;
}

export = Animanaged;