//Serve pages

//Dependencies
//Node.js Modules
import { join } from 'path';

//Npm Modules
import express from 'express';

//My Modules
import serverPath from "../server-path.js";
import options from "./options.js";

const serve = router => {
    //Main page
    router.get("/", (req, res) => {
        res.sendFile(join(serverPath, "./pages/index/index.html"), options);
    });

    //Create page
    router.get("/create", (req, res) => {
        res.sendFile(join(serverPath, "./pages/create/create.html"), options);
    });
    router.use("/create", express.static(join(serverPath, "./pages/create/")));
};

//Export the serve function
export default serve;