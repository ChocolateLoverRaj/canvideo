//Check if something is instanceof another

//Capital O in instanceOf
function instanceOf(c){
    return a => a instanceof c ? false : `is not an instance of ${c}.`;
};

//Export the function
module.exports = instanceOf;