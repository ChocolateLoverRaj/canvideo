export interface Shapes {
    rectangle: [x: number, y: number, width: number, height: number],
    circle: [x: number, y: number, r: number]
}

export type AllShapeData = { [K in keyof Shapes]: [K, Shapes[K]] }

export type ShapeData = AllShapeData[keyof AllShapeData]
