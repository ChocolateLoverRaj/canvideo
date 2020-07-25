//Expect an error to be thrown
function expectError(action) {
    if (typeof action === 'function') {
        var threw = false;
        try {
            action();
        }
        catch (err) {
            threw = true;
        }
        if (!threw) {
            throw new Error("Expected error to be thrown, but no error was thrown.");
        }
    }
    else {
        throw new TypeError("action must be a function.");
    }
};

//Export the function
export default expectError;