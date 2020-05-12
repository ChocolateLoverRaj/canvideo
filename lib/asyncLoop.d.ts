import events = require('events');

type errors = Map<number, Error>;

interface AsyncLoop {
    on(event: "result", error: false);
    on(event: "result", error: Error, num: number);
    on(event: "done", handler: (errors: false | errors) => void);
}
class AsyncLoop extends events.EventEmitter {
    constructor(goal?: number): this;

    goal: number;
    errors: errors;
}

export = AsyncLoop;