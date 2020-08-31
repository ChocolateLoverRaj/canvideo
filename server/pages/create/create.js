import { init as initJsonEditor } from "./json-editor.js";
import { init as previewInit } from "./preview.js";
import downloadInit from "./download.js";
import saveAsInit from "./save-as.js";

window.addEventListener('load', async () => {
    previewInit();
    initJsonEditor();
    downloadInit();
    saveAsInit();
});