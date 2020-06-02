import calculator = require("./calculator");

abstract class Animanaged<T extends Object> extends AnimanagedInterface<T>{
    animate(startTime: number, duration: number, calculator: calculator<Animanaged>): this;
    set(at: number, value: Animanaged): this;
    at(progress: number): T;
}

export = Animanaged;