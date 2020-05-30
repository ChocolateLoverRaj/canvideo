//File for creating interfaces based on types

//Dependencies
const Types = require("./types");

//Interface function
function interface(o, extendible = true) {
    let err = Types.OBJECT(o);
    if (!err) {
        let err = Types.BOOLEAN(extendible);
        if (!err) {
            let keys = new Map();
            for (let k in o) {
                let v = o[k];
                let { type, required } = v;
                for (let k in v) {
                    if (!["type", "required"].includes(k)) {
                        throw new TypeError(`extra key: ${k}, is not allowed.`);
                    }
                }
                if (typeof required === 'undefined') {
                    required = false;
                }
                else {
                    let err = Types.BOOLEAN(required);
                    if (err) {
                        throw new TypeError(`required: ${required}, ${err}`);
                    }
                }
                let err = Types.TYPE(type);
                if (!err) {
                    keys.set(k, { type, required });
                }
                else {
                    throw new TypeError(`type: ${type}, ${err}`);
                }
            }
            return returnInterface(keys, extendible);
        }
        else {
            throw new TypeError(`extendible: ${extendible}, ${err}`);
        }
    }
    else {
        throw new TypeError(`o: ${o} ${err}`);
    }
};

//Interface class
class Interface {
    constructor(extendible = true) {
        let err = Types.BOOLEAN(extendible);
        if (!err) {
            this.extendible = extendible;
            this.keys = new Map();
        }
        else {
            throw new TypeError(`extendible: ${extendible}, ${err}`);
        }
    }
    key(key, type, required = true) {
        let err = Types.STRING(key);
        if (!err) {
            let err = Types.TYPE(type);
            if (!err) {
                let err = Types.BOOLEAN(required);
                if (!err) {
                    this.keys.set(key, {
                        type: type,
                        required: required
                    });
                }
                else {
                    throw new TypeError(`required: ${required}, ${err}`);
                }
            }
            else {
                throw new TypeError(`type: ${type}, ${err}`);
            }
        }
        else {
            throw new TypeError(`key: ${key}, ${err}`);
        }
        return this;
    }
    required(key, type) {
        return this.key(key, type, true);
    }
    optional(key, type) {
        return this.key(key, type, false);
    }
    toType() {
        return returnInterface(this.keys, this.extendible);
    }
}

//Export the module
module.exports = {
    interface,
    Interface
};