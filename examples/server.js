//Create a server on localhost to use user interface to create videos.

//Dependencies
const { createRouter } = require("../index");
const express = require("express");

//Create an express app
const app = express();

//Get an express router
const router = createRouter();

//Use the router with the server
app.use("/", router);

//Start the server
app.listen(2400, () => {
    console.log("Started server.");
});