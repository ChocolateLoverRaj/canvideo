export interface OperationsInterface {
    setFillStyle: [color: string]
    fillRect: [x: number, y: number, width: number, height: number]
}

export type AllOperations = { [K in keyof OperationsInterface]: [K, OperationsInterface[K]] }

export type Operations = AllOperations[keyof AllOperations]
