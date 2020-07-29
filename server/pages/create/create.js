import getEditor from "/web/json-editor.js";
import {
    options as jsonSchemaOptions,
    initialJson
} from "./json-schema.js";

//FIXME problems with rollup and super with inheriting properties
const options = {
    ...jsonSchemaOptions,
    mode: 'code',
    modes: ['code', 'tree']
}
window.addEventListener("load", async () => {
    const container = document.getElementById("json");

    let JsonEditor = await getEditor();

    const editor = new JsonEditor(container, options, initialJson);
});