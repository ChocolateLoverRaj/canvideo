//Manage loops asynchronously

//Dependencies
const EventEmitter = require('events').EventEmitter;

class AsnycLoop extends EventEmitter {
    constructor(goal = 0) {
        super();
        if (typeof goal == 'number') {
            this.goal = goal;
        }
        else {
            throw new TypeError("goal is not a number.");
        }
        this.results = 0;
        this.errors = new Map();
        this.hasError = false;
        this.on("result", (err, num) => {
            if (err === false) {
                this.results++;
            }
            else if (err instanceof Error) {
                if (typeof num == 'number') {
                    this.hasError = true;
                    this.errors.set(num, err);
                    this.results++;
                }
                else {
                    throw new TypeError("num isn't a number.");
                }
            }
            else {
                throw new TypeError("err must be either false or an Error.");
            }
        });
    }
    set results(value) {
        if (typeof value == 'number') {
            this._results = value;
            if (this.results == this.goal) {
                this.emit("done", this.hasError ? this.errors : false);
            }
        }
        else {
            throw new TypeError("results is not a number.");
        }
    }
    get results() {
        return this._results;
    }
}

//Export the class
module.exports = AsnycLoop;