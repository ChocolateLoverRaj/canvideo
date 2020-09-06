import { getText } from "./json-editor.js";
import { open } from "./ls.js";

var saveCheckbox;
var saveForm;

var overwriteCheckbox;
var overwriteName;
var overwriteConfirm;

const savesItem = open("saves");

const submitHandler = e => {
    e.preventDefault();

    const saveName = saveForm.name.value;

    const save = () => {
        saveCheckbox.checked = false;
        savesItem.data.selected = saveName;
        savesItem.data.saves[saveName] = getText();
        savesItem.save();
    }

    if (!savesItem.data.saves[saveName]) {
        //The name is not taken
        save();
    }
    else {
        const confirmListener = () => {
            overwriteCheckbox.checked = false;
            save();
        };

        //Already a save with that name
        overwriteName.innerText = saveName;
        overwriteCheckbox.checked = true;
        overwriteCheckbox.addEventListener('change', () => {
            overwriteConfirm.removeEventListener('click', confirmListener);
        });
        overwriteConfirm.addEventListener('click', confirmListener);
    }
};

const init = () => {
    saveCheckbox = document.getElementById("modals__save-as__checkbox");
    saveForm = document.getElementById("modals__save-as__form");
    saveForm.addEventListener('submit', submitHandler);

    overwriteCheckbox = document.getElementById("modals__overwrite__checkbox");
    overwriteName = document.getElementById("modals__overwrite__name");
    overwriteConfirm = document.getElementById("modals__overwrite__confirm");
};

export default init;