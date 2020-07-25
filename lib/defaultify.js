//Easily assign default properties to objects
//For example
/* Default Object
{
    name: "New Thing",
    description: "A detailed description."
} */
/* Given Object
{
    name: "Hi"
} */
/* Output Object
{
    name: "Hi",
    description: "A detailed description."
} */

//Declare and export function
const defaultify = (properties, defaultProperties) => {
    const anyDefault = (g, d) => {
        if (typeof d === 'object') {
            return objectDefault(g, d);
        }
        else if (typeof g === 'undefined') {
            return d;
        }
        else {
            return g;
        }
    }
    const objectDefault = (g, d) => {
        if (typeof g === 'object') {
            var o = {};
            for (var k in d) {
                o[k] = anyDefault(g[k], d[k]);
            }
            return o;
        }
        else {
            return d;
        }
    }
    return anyDefault(properties, defaultProperties);
};

export default defaultify;