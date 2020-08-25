//Gets options for either weird heroku paths or normal paths

//Dependencies
import serverPath from "../server-path.js";

var options;
if (serverPath.split("/")[0].endsWith(":")) {
    options = {};
}
else {
    options = { root: "/" };
}

console.log(serverPath, options);

//Export the options
export default options;