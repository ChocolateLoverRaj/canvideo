//File for managing server for web gui.

//Dependencies
//Node.js Modules
const path = require('path');

//Npm Modules
const express = require('express');

//Get the path of the paper css minified file
const paperCssPath = require.resolve('papercss/dist/paper.min.css');

//Get the path of json editor minified css and js files
const jsonEditorPaths = {
    css: require.resolve('jsoneditor/dist/jsoneditor.min.css'),
    js: require.resolve('jsoneditor/dist/jsoneditor.min.js'),
    map: require.resolve('jsoneditor/dist/jsoneditor.map'),
    svg: require.resolve('jsoneditor/dist/img/jsoneditor-icons.svg')
};

//Function that returns an express router.
const createRouter = () => {
    //Server path
    const serverPath = path.join(__dirname, "./");

    //Create an express router
    let router = express.Router();

    //Testing
    router.get("/module.js", (req, res) => {
        res.sendFile(path.join(serverPath, "./pages/module.js"));
    });

    //Main page
    router.get("/", (req, res) => {
        res.sendFile(path.join(serverPath, "./pages/index.html"));
    });

    //Create page
    router.get("/create", (req, res) => {
        res.sendFile(path.join(serverPath, "./pages/create.html"));
    });
    router.get("/create.css", (req, res) => {
        res.sendFile(path.join(serverPath, "./pages/create.css"));
    });
    router.get("/create.js", (req, res) => {
        res.sendFile(path.join(serverPath, "./pages/create.js"));
    });

    //Paper css
    router.get("/paper.min.css", (req, res) => {
        res.sendFile(paperCssPath);
    });

    //Json editor
    router.get("/json-editor.min.css", (req, res) => {
        res.sendFile(jsonEditorPaths.css);
    });
    router.get("/json-editor.min.js", (req, res) => {
        res.sendFile(jsonEditorPaths.js);
    });
    router.get("/jsoneditor.map", (req, res) => {
        res.sendFile(jsonEditorPaths.map);
    });
    router.get("/img/jsoneditor-icons.svg", (req, res) => {
        res.sendFile(jsonEditorPaths.svg);
    });

    //Static directories
    router.use("/lib", express.static(path.join(serverPath, "./lib")));
    router.use("/static", express.static(path.join(serverPath, "./static")));

    return router;
};

//Export the createRouter function
module.exports = createRouter;