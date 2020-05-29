//Manage and animate properties
class PropertyManager {
    constructor(properties) {
        if (typeof properties === 'object') {
            for (let k in properties) {
                let type = properties[k];
                let hiddenKey = '_' + k;

                if (typeof type === 'function' && type.length === 1) {
                    Object.defineProperty(this, k, {
                        configurable: true,
                        enumerable: true,
                        set: v => {
                            var typeErr = type(v);
                            if (!typeErr) {
                                this[hiddenKey] = v;
                            }
                            else {
                                throw new TypeError(`${k}: ${v}, ${typeErr}`);
                            }
                        },
                        get() {
                            return this[hiddenKey];
                        }
                    });
                }
                else {
                    throw new TypeError(`type ${type} is not a valid Type for property ${k}.`);
                }
            }
        }
        else {
            throw new TypeError("properties must be an object.");
        }
    };
}

//Export the module
module.exports = PropertyManager;