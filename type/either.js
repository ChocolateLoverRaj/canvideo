//File that creates either type.
//Give a type based on two types.

//Dependencies
import { TYPE } from "./types";
import arrayOf from "./array-of";

//Fine with either types
export default either = (type, ...types) => {
    let err = TYPE(type);
    if (!err) {
        let err = arrayOf(TYPE)(types);
        if (!err) {
            types.unshift(type);
            return a => {
                var errs = [];
                for (var i = 0; i < types.length; i++) {
                    let err = types[i](a);
                    if (!err) {
                        return false;
                    }
                    else {
                        errs.push(err);
                    }
                }
                return errs.join("\nAnd it ");
            };
        }
        else {
            throw new TypeError(`types: ${types}, ${err}`);
        }
    }
    else {
        throw new TypeError(`type: ${type}, ${err}`);
    }
};