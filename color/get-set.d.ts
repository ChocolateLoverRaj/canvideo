export interface SetColor{
    r?: number;
    g?: number;
    b?: number;
    a?: number;
}

export type setColor = string | SetColor;

export interface GetColor {
    r: number;
    g: number;
    b: number;
    a: number;
    hexString: string;
}