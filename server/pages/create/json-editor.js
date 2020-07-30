import getEditor from "/web/json-editor.js";
import {
    options as jsonSchemaOptions,
    initialJson
} from "./json-schema.js";

const options = {
    ...jsonSchemaOptions,
    mode: 'code',
    modes: ['code', 'tree']
}

const editorPromise = getEditor();
const init = async () => {
    const container = document.getElementById("json__editor");
    let JsonEditor = await editorPromise;
    const editor = new JsonEditor(container, options, initialJson);
    startDownloader(editor);
}

const startDownloader = (editor) => {
    const download = document.getElementById("json__download");
    download.addEventListener('click', () => {
        let blob = new Blob([editor.getText()], { type: "application/json;charset=utf-8" });
        download.setAttribute('href', URL.createObjectURL(blob));
    });
}


export default init;