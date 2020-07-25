//File for managing server for web gui.

//Dependencies
//Node.js Modules
import { join, dirname } from 'path';

//Npm Modules
import express from 'express';

//Get a normal path from import.meta.resolve
const importPath = async lib => await import.meta.resolve(lib).substring(8);

//Dirname
// file:///
// 01234567
const myDirname = dirname(import.meta.url).substring(8);

//Get the path of the paper css minified file
console.log(import.meta.resolve('papercss/dist/paper.min.css'));
const paperCssPath = importPath('papercss/dist/paper.min.css');

//Get the path of json editor minified css and js files
const jsonEditorPaths = {
    css: importPath('jsoneditor/dist/jsoneditor.min.css'),
    js: importPath('jsoneditor/dist/jsoneditor.min.js'),
    map: importPath('jsoneditor/dist/jsoneditor.map'),
    svg: importPath('jsoneditor/dist/img/jsoneditor-icons.svg')
};

//Function that returns an express router.
const createRouter = () => {
    //Server path
    const serverPath = myDirname;
    console.log(serverPath);

    //Web path
    const webPath = join(myDirname, "../web/");

    //Create an express router
    let router = express.Router();

    //Testing
    router.get("/module.js", (req, res) => {
        res.sendFile(join(serverPath, "./pages/module.js"));
    });

    //Main page
    router.get("/", (req, res) => {
        res.sendFile(join(serverPath, "./pages/index.html"));
    });

    //Create page
    router.get("/create", (req, res) => {
        res.sendFile(join(serverPath, "./pages/create.html"));
    });
    router.get("/create.css", (req, res) => {
        res.sendFile(join(serverPath, "./pages/create.css"));
    });
    router.get("/create.js", (req, res) => {
        res.sendFile(join(serverPath, "./pages/create.js"));
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
    router.use("/web", express.static(webPath));
    router.use("/static", express.static(join(serverPath, "./static")));

    return router;
};

export default createRouter;