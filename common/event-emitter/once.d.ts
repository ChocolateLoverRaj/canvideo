import EventEmitter from "./emitter";

declare function once(emitter: EventEmitter, event: string | symbol): Promise<Array<any>>;

export default once;