//Keyboard shortcuts actually do things.
import shortcutsEmitter from "./detect-shortcuts.js";
import { download } from "./download.js";

var shortcutsCheckbox;
var saveAsCheckbox;
var loadCheckbox;
var settingsCheckbox;
var uploadCheckbox;

shortcutsEmitter.on("show-shortcuts", () => {
    shortcutsCheckbox.checked = true;
});

//TODO save

shortcutsEmitter.on("save-as", () => {
    saveAsCheckbox.checked = true;
});


shortcutsEmitter.on("load", () => {
    loadCheckbox.checked = true;
});

shortcutsEmitter.on("open-settings", () => {
    settingsCheckbox.checked = true;
});

shortcutsEmitter.on("download", () => {
    download();
});

shortcutsEmitter.on("upload", () => {
    uploadCheckbox.checked = true;
});

const init = () => {
    shortcutsCheckbox = document.getElementById("modals__shortcuts__checkbox");
    saveAsCheckbox = document.getElementById("modals__save-as__checkbox");
    loadCheckbox = document.getElementById("modals__load__checkbox");
    settingsCheckbox = document.getElementById("modals__settings__checkbox");
    uploadCheckbox = document.getElementById("modals__upload__checkbox");
};

export default init;