export declare interface SetColor{
    r?: number;
    g?: number;
    b?: number;
    a?: number;
}

export declare type setColor = string | SetColor;

export declare interface GetColor {
    r: number;
    g: number;
    b: number;
    a: number;
    hexString: string;
}