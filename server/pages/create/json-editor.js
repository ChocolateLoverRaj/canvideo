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
const init = async container => {
    let JsonEditor = await getEditor();
    const editor = new JsonEditor(container, options, initialJson);
};

export default init;