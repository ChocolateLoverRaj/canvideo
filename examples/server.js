//Create a server on localhost to use user interface to create videos.

//Dependencies
import { createRouter } from 'canvideo';
import express from 'express';

//The port the server listens to
const port = process.env.PORT || 2400;

//Create an express app
const app = express();

//Get an express router
createRouter().then(router => {
    //Use the router with the server
    app.use("/", router);

    //Start the server
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});