//File for creating interfaces based on types

//Dependencies
import { OBJECT, BOOLEAN, TYPE, STRING } from "./types";

//Generate type function from given map
const returnInterface = (keys, extendible) => {
    return a => {
        var err = OBJECT(a);
        if (!err) {
            for (let [k, { type, required }] of keys.entries()) {
                if (a.hasOwnProperty(k)) {
                    let v = a[k];
                    let err = type(v);
                    if (err) {
                        return `invalid type for property: ${k}, ${v} ${err}`;
                    }
                }
                else if (required) {
                    return `property: ${k}, is required but not present.`;
                }
            }
            if (!extendible) {
                let aKeys = Object.keys(a);
                for (var i = 0; i < aKeys.length; i++) {
                    let k = aKeys[i];
                    if (!keys.has(k)) {
                        return `extra property: ${k} is not allowed.`;
                    }
                }
            }
            return false;
        }
        else {
            return `${err}`;
        }
    };
}

//Interface function
export const interface = (o, extendible = true) => {
    let err = OBJECT(o);
    if (!err) {
        let err = BOOLEAN(extendible);
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
                    let err = BOOLEAN(required);
                    if (err) {
                        throw new TypeError(`required: ${required}, ${err}`);
                    }
                }
                let err = TYPE(type);
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
export class Interface {
    constructor(extendible = true) {
        let err = BOOLEAN(extendible);
        if (!err) {
            this.extendible = extendible;
            this.keys = new Map();
        }
        else {
            throw new TypeError(`extendible: ${extendible}, ${err}`);
        }
    }
    key(key, type, required = true) {
        let err = STRING(key);
        if (!err) {
            let err = TYPE(type);
            if (!err) {
                let err = BOOLEAN(required);
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