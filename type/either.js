//File that creates either type.
//Give a type based on two types.

//Dependencies
const Types = require("./types");
const arrayOf = require("./array-of");

//Fine with either types
function either(type, ...types){
    let err = Types.TYPE(type);
    if(!err){
        let err = arrayOf(Types.TYPE)(types);
        if(!err){
            types.unshift(type);
            return a => {
                var errs = [];
                for(var i = 0; i < types.length; i++){
                    let err = types[i](a);
                    if(!err){
                        return false;
                    }
                    else{
                        errs.push(err);
                    }
                }
                return errs.join("\nAnd it ");
            };
        }
        else{
            throw new TypeError(`types: ${types}, ${err}`);
        }
    }
    else{
        throw new TypeError(`type: ${type}, ${err}`);
    }
};

//Export the module
module.exports = either;