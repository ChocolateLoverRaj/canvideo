import calculator = require("./calculator");

declare abstract class Animanaged<T extends Object> {
    isExplicitlySet(key: string): boolean;
    animate(startTime: number, duration: number, calculator: calculator<Animanaged<T>>): this;
    set(at: number, value: Animanaged<T>): this;
    at(progress: number): T;
}

export = Animanaged;