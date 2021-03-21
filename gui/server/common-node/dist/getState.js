"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseStates = void 0;
// Get the state of a promise
var PromiseStates;
(function (PromiseStates) {
    PromiseStates["PENDING"] = "pending";
    PromiseStates["RESOLVED"] = "resolved";
    PromiseStates["REJECTED"] = "rejected";
})(PromiseStates = exports.PromiseStates || (exports.PromiseStates = {}));
const getState = (promise) => {
    const stateObj = {
        promise: promise,
        state: PromiseStates.PENDING
    };
    promise
        .then(v => {
        stateObj.state = PromiseStates.RESOLVED;
        stateObj.value = v;
    })
        .catch(() => {
        stateObj.state = PromiseStates.REJECTED;
    });
    return stateObj;
};
exports.default = getState;
