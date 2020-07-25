declare function defaultify(properties: any, defaultProperties: any): any;
declare function defaultify<D extends object>(properties: any, defaultProperties: D): D;

export default defaultify;