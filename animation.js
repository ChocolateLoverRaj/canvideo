//File for making linear animations
//Just give an object of keys

//Dependencies
const { typedFunction, Types } = require("./type");

class Animation {
    constructor() {
        typedFunction([
            {
                name: "startValue",
                type: Types.OBJECT
            },
            {
                name: "endValue",
                type: Types.OBJECT
            }
        ], function (startValue, endValue) {
            function checkProperties(s, e) {
                //Make sure that endValue doesn't have properties that startValue doesn't have.
                let sKeys = Object.keys(s);
                let eKeys = Object.keys(e);
                for (var i = 0; i < eKeys.length; i++) {
                    let key = eKeys[i];
                    if (!sKeys.includes(key)) {
                        return `${key} is included in endValue but not in startValue.`;
                    }
                }
                for (let k in s) {
                    if (s.hasOwnProperty(k)) {
                        let v = s[k];
                        function checkProperty() {
                            switch (typeof v) {
                                case 'object':
                                    let err = checkProperties(v, e[k]);
                                    if (!err) {
                                        return false;
                                    }
                                    else {
                                        return `${k}.${err}`;
                                    }
                                case 'number':
                                    if (e.hasOwnProperty(k)) {
                                        let sType = typeof v;
                                        let eType = typeof e[k];
                                        if (sType === eType) {
                                            return false
                                        }
                                        else {
                                            return `${k} is a ${sType} in startValue but a ${eType} in endValue.`;
                                        }
                                    }
                                    else {
                                        return `${k} is in startValue but not in endValue.`;
                                    }
                                default:
                                    return `${k} is not a number.`;
                            }
                        }
                        let err = checkProperty();
                        if (err) {
                            return err;
                        }
                    }
                }
            };
            let err = checkProperties(startValue, endValue);
            if (!err) {
                this.startValue = startValue;
                this.endValue = endValue;
            }
            else {
                throw new TypeError(`Bad values because property: ${err}`);
            }
        }).apply(this, arguments);
    }

    calculator = typedFunction([{ name: "progress", type: Types.UNIT_INTERVAL }], function (progress) {
        //If the reverse effect is enabled, then alter the progress.
        if (this.reversed) {
            progress = 1 - Math.abs(progress * 2 - 1);
        }
        const calcNumber = (s, e) => s + progress * (e - s);
        const calcObject = (s, e) => {
            var o;
            if(s instanceof Array && e instanceof Array){
                o = [];
            }
            else{
                o = {};
            }
            for (var k in s) {
                let sV = s[k];
                let eV = e[k];
                switch (typeof sV) {
                    case 'object':
                        o[k] = calcObject(sV, eV);
                        break;
                    case 'number':
                        o[k] = calcNumber(sV, eV);
                        break;
                }
            }
            return o;
        }
        return calcObject(this.startValue, this.endValue);
    }).bind(this);

    getCalculator() {
        return this.calculator;
    }

    last() {
        this.calculator.lasts = true;
        return this;
    }

    reversed = false;
    reverse() {
        this.reversed = true;
        return this;
    }
};

//Export the module
module.exports = Animation;