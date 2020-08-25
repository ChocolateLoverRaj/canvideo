//Get the path of the server folder.

//Dependencies
import { dirname } from 'path';

//Dirname
// file:///
// 01234567
var myDirname = dirname(import.meta.url).substring(8);

//If there is an abnormal path, such as app/, then prepend a / to avoid file system errors.
if (!myDirname.split("/")[0].endsWith(":")) {
    myDirname = "/" + myDirname;
}


//Export the dirname
export default myDirname;