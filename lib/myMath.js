//My Math module that does things that the normal javascript math module can't do.

//Module
const myMath = {};

//Round to nearest x
myMath.round = function (num, interval) {
    if (typeof num == 'number' && typeof interval == 'number') {
        return Math.round(num / interval) * interval;
    }
    else {
        throw new TypeError("num and interval must be numbers.");
    }
}

//Check if number is even
myMath.isEven = function (n) {
    if (typeof n == 'number') {
        return n & 1 ? false : true;
    }
    else {
        throw new TypeError("n is not a number.");
    }
}

//Check if number is odd
myMath.isOdd = function (n) {
    if (typeof n == 'number') {
        return n & 1 ? true : false;
    }
    else {
        throw new TypeError("n is not a number.");
    }
}

//Export the module
module.exports = myMath;