//Manage settings
import { open } from "./ls.js";

const settingsItem = open("settings");

var autoSave;
var frequencyCheckbox;
var frequencyInput;

const setAutoSave = () => {
    if (frequencyCheckbox.checked) {
        settingsItem.data.autoSave = {
            frequency: parseInt(frequencyInput.value)
        };
    }
    else {
        settingsItem.data.autoSave = false;
    }
    settingsItem.save();
};

const autoSaveHandler = () => {
    frequencyCheckbox.checked = autoSave.checked;
    setAutoSave();
}

const init = () => {
    autoSave = document.getElementById("modals__settings__auto-save");
    autoSave.addEventListener('change', autoSaveHandler);
    frequencyCheckbox = document.getElementById("modals__settings__frequency-checkbox");
    frequencyInput = document.getElementById("modals__settings__frequency");
    frequencyInput.addEventListener('change', setAutoSave);
    if (settingsItem.data.autoSave) {
        autoSave.checked = true;
        frequencyCheckbox.checked = true;
        frequencyInput.value = settingsItem.data.autoSave.frequency;
    }
};

export default init;