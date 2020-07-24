//Check if something is instanceof another

//Capital O in instanceOf
export default instanceOf = c => a => a instanceof c ? false : `is not an instance of ${c}.`;