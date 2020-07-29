//File for making linear animations
//Just give an object of keys

//Dependencies
import typedFunction from "../type/typed-function.js";
import Types from "../type/types.js";

class Animation {
    static animationName = "animation";
    animationName = "animation";

    static fromJson(json, parse = true, throwErrors = false) {
        if (typeof json === 'string' && parse === true) {
            try {
                json = JSON.parse(json);
            }
            catch (e) {
                if (throwErrors) {
                    throw e;
                }
                else {
                    return false;
                }
            }
        }
        else if (parse !== false) {
            throw new TypeError("Cannot parse non string json.");
        }
        try {
            let { startValue, endValue, reversed } = json;
            let animation = new Animation(startValue, endValue);
            if (reversed) {
                animation.reverse();
            }
            return animation;
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    }

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

    calculate() {
        return typedFunction([{ name: "progress", type: Types.UNIT_INTERVAL }], function (progress) {
            //If the reverse effect is enabled, then alter the progress.
            if (this.reversed) {
                progress = 1 - Math.abs(progress * 2 - 1);
            }
            const calcNumber = (s, e) => s + progress * (e - s);
            const calcObject = (s, e) => {
                var o;
                if (s instanceof Array && e instanceof Array) {
                    o = [];
                }
                else {
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
        }).apply(this, arguments);
    }

    lasts = false;
    last() {
        this.lasts = true;
        return this;
    }

    reversed = false;
    reverse() {
        this.reversed = true;
        return this;
    }

    toJson(stringify = true) {
        let o = {
            startValue: this.startValue,
            endValue: this.endValue,
            reversed: this.reversed
        };
        if (stringify === true) {
            return JSON.stringify(o);
        }
        else if (stringify === false) {
            return o;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
};

export default Animation;