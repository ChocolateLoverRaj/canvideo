//Serve pages

//Dependencies
//Node.js Modules
import { join } from 'path';

//Npm Modules
import express from 'express';

//My Modules
import serverPath from "../server-path.js";

const serve = router => {
    //Main page
    router.get("/", (req, res) => {
        console.log(serverPath);
        console.log(join(serverPath, "./pages/index/index.html"))
        res.sendFile(join(serverPath, "./pages/index/index.html"));
    });

    //Create page
    router.get("/create", (req, res) => {
        res.sendFile(join(serverPath, "./pages/create/create.html"));
    });
    router.use("/create", express.static(join(serverPath, "./pages/create/")));
};

//Export the serve function
export default serve;