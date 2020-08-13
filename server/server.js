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
    const tinyColor = import.meta.resolve('tinycolor2/dist/tinycolor-min.js');
    const eventEmitter = import.meta.resolve('eventemitter3/umd/eventemitter3.min.js');
    await Promise.all([paperCss, jsonEditor, tinyColor, eventEmitter]);

    const jsonEditorDist = join(dirname(await jsonEditor).substring(8), './dist/');

    return {
        paperCss: (await paperCss).substring(8),
        jsonEditor: {
            css: join(jsonEditorDist, "./jsoneditor.min.css"),
            js: join(jsonEditorDist, "./jsoneditor.min.js"),
            map: join(jsonEditorDist, "./jsoneditor.map"),
            svg: join(jsonEditorDist, "./img/jsoneditor-icons.svg")
        },
        tinyColor: (await tinyColor).substring(8),
        eventEmitter: (await eventEmitter).substring(8)
        
    };
})();

//Function that returns an express router.
const createRouter = async () => {
    //Wait for resource paths
    const {
        paperCss: paperCssPath,
        jsonEditor: jsonEditorPaths,
        tinyColor: tinyColorPath,
        eventEmitter: eventEmitterPath
    } = await resPaths;

    //Server path
    const serverPath = myDirname;

    //Web path
    const webPath = join(myDirname, "../web/");

    //Common path
    const commonPath = join(myDirname, "../common/");

    //Create an express router
    let router = express.Router();

    //Testing
    router.get("/module.js", (req, res) => {
        res.sendFile(join(serverPath, "./pages/module.js"));
    });

    //Main page
    router.get("/", (req, res) => {
        res.sendFile(join(serverPath, "./pages/index/index.html"));
    });

    //Create page
    router.get("/create", (req, res) => {
        res.sendFile(join(serverPath, "./pages/create/create.html"));
    });
    router.use("/create", express.static(join(serverPath, "./pages/create/")));

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

    //Tiny Color
    router.get("/tiny-color.min.js", (req, res) => {
        res.sendFile(tinyColorPath);
    });

    //eventemitter3
    router.get("/event-emitter.min.js", (req, res) => {
        res.sendFile(eventEmitterPath);
    });

    //Static directories
    router.use("/common", express.static(webPath));
    router.use("/common", express.static(commonPath));

    router.use("/web", express.static(webPath));
    
    router.use("/static", express.static(join(serverPath, "./static")));

    return router;
};

export default createRouter;