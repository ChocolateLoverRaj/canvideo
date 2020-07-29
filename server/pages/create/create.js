import initJsonEditor from "./json-editor.js";

window.addEventListener('load', () => {
    const jsonEditorContainer = document.getElementById("json-container");
    initJsonEditor(jsonEditorContainer);
});