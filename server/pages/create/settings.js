//Manage settings
import { saves, saveSaves } from "./saves.js";

var autoSave;
var frequencyCheckbox;
var frequencyInput;

const setAutoSave = () => {
    if (frequencyCheckbox.checked) {
        saves.autoSave = {
            frequency: parseInt(frequencyInput.value)
        };
    }
    else {
        saves.autoSave = false;
    }
    saveSaves();
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
};

export default init;