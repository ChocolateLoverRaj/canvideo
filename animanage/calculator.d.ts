declare interface CalculatorSettings{
    lasts?: boolean;
}

declare type calculator<Value> = ((progress: number) => Value) & CalculatorSettings;

export = calculator;