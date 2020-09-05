import { init as initJsonEditor } from "./json-editor.js";
import { init as previewInit } from "./preview.js";
import downloadInit from "./download.js";
import saveAsInit from "./save-as.js";
import loadInit from "./load.js";
import uploadInit from "./upload.js";
import settingsInit from "./settings.js";
import shortcutsInit from "./manage-shortcuts.js";

window.addEventListener('load', async () => {
    previewInit();
    initJsonEditor();
    downloadInit();
    saveAsInit();
    loadInit();
    uploadInit();
    settingsInit();
    shortcutsInit();
});