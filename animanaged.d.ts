declare abstract class Animanaged<T extends Object>{
    animate(startTime: number, duration: number, calculator: (progress: number) => Animanaged<T>): this;
    at(progress: number): T;
}

export = Animanaged;