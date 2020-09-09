//Actually save the text
import { open } from "./ls.js";
import { getText } from "./json-editor.js";

//TODO - Warn user of unsaved changes before leaving page.

var savedCheckbox;
var modifiedIcon;
var saveButton;
var saveAsCheckbox;

const savesItem = open("saves");
const settingsItem = open("settings");

var lastSaved = -Infinity;
var saveTimer = null;

export const save = () => {
    if (savesItem.data.selected) {
        clearTimeout(saveTimer);
        saveTimer = null;
        savesItem.data.saves[savesItem.data.selected] = getText();
        savesItem.save();
        lastSaved = Date.now();
        savedCheckbox.checked = false;
        setTimeout(() => {
            savedCheckbox.checked = true;
        }, 0);
    }
    else {
        saveAsCheckbox.checked = true;
    }
};

export const autoSave = () => {
    savedCheckbox.checked = false;
    if (settingsItem.data.autoSave) {
        if (Date.now() >= lastSaved + settingsItem.data.autoSave.frequency * 1000) {
            save();
        }
        else if (!saveTimer) {
            saveTimer = setTimeout(save, settingsItem.data.autoSave.frequency * 1000);
        }
    }
};

export const init = () => {
    savedCheckbox = document.getElementById("save-state__checkbox");
    modifiedIcon = document.getElementById("save-state__modified");
    modifiedIcon.addEventListener('click', save);
    saveButton = document.getElementById("menu__project__save");
    saveButton.addEventListener('click', save);
    saveAsCheckbox = document.getElementById("modals__save-as__checkbox");
};