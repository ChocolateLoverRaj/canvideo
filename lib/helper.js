//Helper to help with different tasks

//Helper modules
const helper = {};

//Recursive assign - Like Object.assign but recursive. Doesn't return Object, changes object.
helper.recursiveAssign = function (target, source) {
    var newTarget = Object.assign(target, {});
    for (var key in source) {
        var value = source[key];
        if (typeof value === 'object') {
            var targetValue = target[key];
            if (typeof targetValue === 'object') {
                newTarget[key] = helper.recursiveAssign(targetValue, value);
            }
            else {
                newTarget[key] = value;
            }
        }
        else {
            newTarget[key] = value;
        }
    }
    return newTarget;
};

//Extend functions
helper.ExtendibleFunction = class {
    constructor() {
        this._action = function () { };
    }

    set action(value) {
        if (typeof value === 'function') {
            const oldAction = this.action.bind({});
            this._action = function () {
                oldAction.apply(undefined, arguments);
                value.apply(undefined, arguments);
            }.bind(this);
        }
        else {
            throw new TypeError("action must be a function.");
        }
    }
    get action() {
        return this._action;
    }
}

//Export the module
module.exports = helper;