//Zero pad a number to the left
const zeroPad = (n, length) => "0".repeat(length - n.toString().length) + n.toString();

export default zeroPad;