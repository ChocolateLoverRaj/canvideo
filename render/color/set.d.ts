interface SetColor{
    r?: number;
    g?: number;
    b?: number;
    a?: number;
}
type setColor = SetColor | string;

export = setColor;