export declare enum PromiseStates {
    PENDING = "pending",
    RESOLVED = "resolved",
    REJECTED = "rejected"
}
export interface StateObj<T> {
    promise: Promise<T>;
    state: PromiseStates;
    value?: T;
}
declare const getState: <T>(promise: Promise<T>) => StateObj<T>;
export default getState;
