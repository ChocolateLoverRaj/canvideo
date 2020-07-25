//File for managing server for web gui.

//Dependencies
//Node.js Modules
import { join, dirname } from 'path';

//Npm Modules
import express from 'express';

//Dirname
// file:///
// 01234567
const myDirname = dirname(import.meta.url).substring(8);

//Promise that gets resource paths
const resPaths = (async () => {
    const paperCss = import.meta.resolve('papercss/dist/paper.min.css');
    const jsonEditor = import.meta.resolve('jsoneditor');
    await Promise.all([paperCss, jsonEditor]);

    const jsonEditorDist = join(dirname(await jsonEditor).substring(8), './dist/');

    return {
        paperCss: (await paperCss).substring(8),
        jsonEditor: {
            css: join(jsonEditorDist, "./jsoneditor.min.css"),
            js: join(jsonEditorDist, "./jsoneditor.min.js"),
            map: join(jsonEditorDist, "./jsoneditor.map"),
            svg: join(jsonEditorDist, "./img/jsoneditor-icons.svg")
        }
    };
})();

//Function that returns an express router.
const createRouter = async () => {
    //Wait for resource paths
    const {
        paperCss: paperCssPath,
        jsonEditor: jsonEditorPaths
    } = await resPaths;

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