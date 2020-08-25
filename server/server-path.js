//Get the path of the server folder.

//Dependencies
import { dirname } from 'path';

//Dirname
// file:///
// 01234567
var myDirname = dirname(import.meta.url).substring(8);

console.log(myDirname)

if (!import.meta.url.split("/")[0].endsWith(":")) {
    myDirname = "/" + myDirname;
}

console.log(myDirname)

//Export the dirname
export default myDirname;