//Get the path of the server folder.

//Dependencies
import { dirname } from 'path';

//Dirname
// file:///
// 01234567
const myDirname = dirname(import.meta.url).substring(8);

//Export the dirname
export default myDirname;