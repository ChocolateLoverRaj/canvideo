//Check if something is instanceof another

//Capital O in instanceOf
const instanceOf = c => a => a instanceof c ? false : `is not an instance of ${c}.`;

export default instanceOf;