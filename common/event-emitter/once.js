const once = (emitter, event) => new Promise((resolve, reject) => {
    emitter.once(event, (...args) => {
        resolve(args);
    });
    emitter.once('error', err => {
        reject(err);
    });
});

export default once;