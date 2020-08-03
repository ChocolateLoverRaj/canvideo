import { init as initJsonEditor } from "./json-editor.js";
import { init as previewInit } from "./preview.js";

window.addEventListener('load', async () => {
    await initJsonEditor();
    previewInit();
});