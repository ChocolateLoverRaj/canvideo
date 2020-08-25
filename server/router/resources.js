//Serve resources like papercss and json editor.

//Dependencies
import { join, dirname } from 'path';
import options from "./options.js";

//Promise that gets resource paths
const resPaths = (async () => {
    const paperCss = import.meta.resolve('papercss/dist/paper.min.css');
    const jsonEditor = import.meta.resolve('jsoneditor');
    const tinyColor = import.meta.resolve('tinycolor2/dist/tinycolor-min.js');
    const eventEmitter = import.meta.resolve('eventemitter3/umd/eventemitter3.min.js');
    const leadingzero = import.meta.resolve('leadingzero');

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
        eventEmitter: (await eventEmitter).substring(8),
        leadingzero: (await leadingzero).substring(8)
    };
})();

//The serve function
const serve = async router => {
    //Wait for resource paths
    const {
        paperCss: paperCssPath,
        jsonEditor: jsonEditorPaths,
        tinyColor: tinyColorPath,
        eventEmitter: eventEmitterPath,
        leadingzero: leadingzeroPath
    } = await resPaths;

    //Paper css
    router.get("/paper.min.css", (req, res) => {
        res.sendFile(paperCssPath, options);
    });

    //Json editor
    router.get("/json-editor.min.css", (req, res) => {
        res.sendFile(jsonEditorPaths.css, options);
    });
    router.get("/json-editor.min.js", (req, res) => {
        res.sendFile(jsonEditorPaths.js, options);
    });
    router.get("/jsoneditor.map", (req, res) => {
        res.sendFile(jsonEditorPaths.map, options);
    });
    router.get("/img/jsoneditor-icons.svg", (req, res) => {
        res.sendFile(jsonEditorPaths.svg, options);
    });

    //Tiny Color
    router.get("/tiny-color.min.js", (req, res) => {
        res.sendFile(tinyColorPath, options);
    });

    //eventemitter3
    router.get("/event-emitter.min.js", (req, res) => {
        res.sendFile(eventEmitterPath, options);
    });

    //leadingzero
    router.get("/leadingzero.js", (req, res) => {
        res.sendFile(leadingzeroPath, options);
    });
};

//Export the serve function
export default serve;