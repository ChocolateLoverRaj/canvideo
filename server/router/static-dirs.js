//Serve static directories

//Dependencies
//Node.js Modules
import { join } from 'path';

//Npm Modules
import express from 'express';

//My Modules
import serverPath from "../server-path.js";

const serve = router => {
    //Web static
    const webStatic = express.static(join(serverPath, "../web/"));

    //Common static
    const commonStatic = express.static(join(serverPath, "../common/"));

    //Static files path
    const staticFiles = express.static(join(serverPath, "./static"));

    router.use("/common", webStatic);
    router.use("/common", commonStatic);

    router.use("/web", webStatic);

    router.use("/static", staticFiles);
}

//Export the serve function
export default serve;