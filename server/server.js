//File for managing server for web gui.

//Dependencies
//Npm Modules
import express from 'express';

//My Modules
import serveResources from "./router/resources.js";
import servePages from "./router/pages.js";
import serveStatic from "./router/static-dirs.js";

//Function that returns an express router.
const createRouter = async () => {
    //Create an express router
    let router = express.Router();

    //Serve resources
    await serveResources(router);

    //Serve pages
    servePages(router);

    //Serve static directories
    serveStatic(router);

    return router;
};

export default createRouter;