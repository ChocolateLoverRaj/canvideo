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
            if(typeof targetValue === 'object'){
                newTarget[key] = helper.recursiveAssign(targetValue, value);
            }
            else{
                newTarget[key] = value;
            }
        }
        else {
            newTarget[key] = value;
        }
    }
    return newTarget;
};

//Export the module
module.exports = helper;