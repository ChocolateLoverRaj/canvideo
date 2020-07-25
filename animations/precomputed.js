//Class for precalculated animations. Created implicitly when exporting and importing json.

//Precomputed class
class Precomputed {
    static animationName = "precomputed";
    animationName = "precomputed";

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
            return new Precomputed(json);
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

    constructor(values) {
        if (values instanceof Array) {
            for (var i = 0; i < values.length; i++) {
                let entry = values[i];
                if (!(entry instanceof Array && entry.length === 2 && typeof entry[0] === 'number' && entry[0] >= 0 && entry[0] <= 1 && typeof entry[1] ===
                    'object')) {
                    throw new TypeError("All entries must be [number (between 0 and 1), object].");
                }
            }
            this.values = values;
        }
        else {
            throw new TypeError("Values must be an array.");
        }
    }

    calculate(progress) {
        if (typeof progress === 'number' && progress >= 0 && progress <= 1) {
            this.values.sort((a, b) => a[0] - b[0]);
            for (var i = 0; i < this.values.length; i++) {
                let changeAt = this.values[i][0];
                if (progress < changeAt) {
                    if (i > 0) {
                        return this.values[i - 1][1];
                    }
                    else {
                        return {};
                    }
                }
            }
            return i > 0 ? this.values[i - 1][1] : {};
        }
        else {
            throw new TypeError("progress must be a number between 0 and 1.");
        }
    }

    lasts = false;
    last() {
        this.lasts = true;
        return this;
    }

    toJson(stringify = true) {
        if (stringify === true) {
            return JSON.stringify(this.values);
        }
        else if (stringify === false) {
            return this.values;
        }
        else {
            throw new TypeError("stringify must be a boolean.");
        }
    }
}

export default Precomputed;