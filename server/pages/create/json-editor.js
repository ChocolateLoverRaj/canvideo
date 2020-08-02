import getEditor from "/web/json-editor.js";
import {
    options as jsonSchemaOptions,
    initialJson
} from "./json-schema.js";

const options = {
    ...jsonSchemaOptions,
    mode: 'code',
    modes: ['code', 'tree'],
    search: false,
    onChange: () => {
        enableSaveButton();
        autoSave();
    }
}

const editorPromise = getEditor();
var editorContainer;
var editor;
const jsonEditorInit = async () => {
    editorContainer = document.getElementById("json__editor");
    let JsonEditor = await editorPromise;
    editor = new JsonEditor(editorContainer, options, initialJson);
}

const downloaderInit = () => {
    const download = document.getElementById("json__download");
    download.addEventListener('click', () => {
        let blob = new Blob([editor.getText()], { type: "application/json;charset=utf-8" });
        download.setAttribute('href', URL.createObjectURL(blob));
    });
}

const uploadInit = () => {
    const InputErrors = {
        NOT_JSON: "Only files with application/json MIME types will be accepted.",
        READ_ERROR: "Error reading file."
    };

    const uploadInput = document.getElementById("json__upload__input");
    const uploadMessage = document.getElementById("json__upload__message");
    const uploadCheckbox = document.getElementById("json__upload__checkbox");

    const displayError = err => {
        uploadInput.disabled = false;
        uploadMessage.innerText = err;
        uploadMessage.classList.add('text-danger');
        uploadMessage.classList.remove('text-warning');
    }

    uploadInput.addEventListener('change', e => {
        const file = uploadInput.files[0];
        if (file.type !== 'application/json') {
            displayError(InputErrors.NOT_JSON);
        }
        else {
            uploadInput.disabled = true;
            uploadMessage.innerText = "Reading File";
            uploadMessage.classList.add('text-warning');
            uploadMessage.classList.remove('text-danger');

            const reader = new FileReader();
            reader.addEventListener('error', e => {
                displayError(InputErrors.READ_ERROR);
            });
            reader.addEventListener('load', e => {
                editor.setText(reader.result);
                uploadCheckbox.checked = false;
                uploadInput.disabled = false;
                uploadMessage.innerText = '';
                uploadMessage.classList.remove('text-danger');
                uploadMessage.classList.remove('text-warning');
            });
            reader.readAsText(file);
        }
    });
}

var enableSaveButton;
var autoSave;
const localStorageInit = () => {
    var saves;
    var confirmDeleteListener;
    var duplicateOverwriteListener;
    var lastSaved = -Infinity;
    var scheduledSave = false;
    var saveKeyDown = false;

    const noSaveSelectedAlert = document.getElementById("local-storage__no-save-selected");
    const saveButton = document.getElementById("local-storage__save");
    const autoSaveForm = document.getElementById("local-storage__auto-save");
    const savesForm = document.getElementById("local-storage__form");
    const savesTableBody = document.getElementById("local-storage__table__body");
    const confirmDeleteCheckbox = document.getElementById("local-storage__confirm-delete__checkbox");
    const confirmDeleteName = document.getElementById("local-storage__confirm-delete__name");
    const confirmDeleteConfirm = document.getElementById("local-storage__confirm-delete__confirm");
    const duplicateCheckbox = document.getElementById("local-storage__duplicate-modal__checkbox");
    const duplicateName = document.getElementById("local-storage__duplicate-modal__name");
    const duplicateOverwrite = document.getElementById("local-storage__duplicate-modal__overwrite");

    enableSaveButton = () => {
        saveButton.setAttribute('title', "Save Changes");
        saveButton.disabled = false;
    }
    const save = () => {
        if (saves.selected) {
            saves.saves[saves.selected] = editor.getText();
            saveToLocalStorage();
            saveButton.setAttribute('title', "Changes Saved");
            saveButton.disabled = true;
        }
        else {
            noSaveSelectedAlert.checked = false;
        }
        lastSaved = Date.now();
    };
    autoSave = () => {
        if (saves.autoSave) {
            if (Date.now() - saves.autoSaveFrequency * 1000 > lastSaved) {
                save();
            }
            else {
                if (!scheduledSave) {
                    setTimeout(() => {
                        save();
                        scheduledSave = false;
                    }, lastSaved + saves.autoSaveFrequency * 1000 - Date.now());
                }
            }
        }
    };
    addEventListener('keydown', e => {
        if(!saveKeyDown){
            if(e.key === "s" && e.ctrlKey){
                console.log("ctrl s")
                e.preventDefault();
                saveKeyDown = true;
                save();
            }
        }
    });
    addEventListener('keyup', e => {
        if(e.key === "s" && e.ctrlKey){
            saveKeyDown = false;
        }
    });
    saveButton.addEventListener('click', save);

    autoSaveForm.addEventListener('submit', e => {
        e.preventDefault();
    });
    autoSaveForm.checkbox.addEventListener('change', () => {
        let checked = autoSaveForm.checkbox.checked;
        autoSaveForm.frequency.disabled = !checked;
        saves.autoSave = checked;
        saveToLocalStorage();
    });
    autoSaveForm.frequency.addEventListener('change', () => {
        let frequency = parseInt(autoSaveForm.frequency.value);
        if (Number.isInteger(frequency) && frequency > 0 && frequency <= 60 * 60) {
            saves.autoSaveFrequency = frequency;
            saveToLocalStorage();
        }
    });

    confirmDeleteCheckbox.addEventListener('change', () => {
        if (confirmDeleteCheckbox.checked === false) {
            confirmDeleteConfirm.removeEventListener('click', confirmDeleteListener);
        }
    });
    duplicateCheckbox.addEventListener('change', () => {
        if (duplicateCheckbox.checked === false) {
            duplicateOverwrite.removeEventListener('click', duplicateOverwriteListener);
        }
    });

    const saveToLocalStorage = () => {
        localStorage.setItem("saves", JSON.stringify(saves));
    };

    const selectSave = name => {
        saves.saves[name] = editor.getText();
        saves.selected = name;
        saveToLocalStorage();
        noSaveSelectedAlert.checked = true;
        refreshTable();
    }

    savesForm.addEventListener('submit', e => {
        e.preventDefault();

        function addSave() {
            if (savesForm.text.value.length > 0) {
                selectSave(savesForm.text.value);
                savesForm.text.value = '';
            }
        }

        if (saves.saves.hasOwnProperty(savesForm.text.value)) {
            duplicateCheckbox.checked = true;
            duplicateName.innerText = savesForm.text.value;
            duplicateOverwriteListener = addSave;
            duplicateOverwrite.addEventListener('click', duplicateOverwriteListener);
        }
        else {
            addSave();
        }
    });

    const refreshTable = () => {
        let savesString = localStorage.getItem("saves");
        saves = savesString ? JSON.parse(savesString) : {
            saves: {},
            selected: null,
            autoSave: false,
            autoSaveFrequency: 10
        };
        autoSaveForm.checkbox.checked = saves.autoSave;
        autoSaveForm.frequency.disabled = !saves.autoSave;
        autoSaveForm.frequency.value = saves.autoSaveFrequency;
        savesTableBody.innerHTML = '';

        //TODO listen for Ctrl+S.
        function uploadSave() {
            selectSave(this.getAttribute("name"));
        }

        //TODO add a function for loading saves.

        function deleteSave() {
            let name = this.getAttribute("name");
            confirmDeleteCheckbox.checked = true;
            confirmDeleteName.innerText = name;
            confirmDeleteListener = function () {
                delete saves.saves[name];
                if (saves.selected === name) {
                    saves.selected = null;
                    saves.autoSave = false;
                }
                saveToLocalStorage();
                refreshTable();
            };
            confirmDeleteConfirm.addEventListener('click', confirmDeleteListener);
        }

        for (let saveName in saves.saves) {
            let row = document.createElement('tr');

            let nameCell = document.createElement('td');
            nameCell.innerText = saveName;
            row.appendChild(nameCell);

            let saveCell = document.createElement('td');
            let saveIcon = document.createElement('i');
            saveIcon.setAttribute("name", saveName);
            saveIcon.classList.add('material-icons');
            saveIcon.classList.add('save-icon');
            saveIcon.innerHTML = saveName === saves.selected ? 'check' : 'save';
            saveIcon.addEventListener('click', uploadSave);
            saveCell.appendChild(saveIcon);
            row.appendChild(saveCell);

            let loadCell = document.createElement('td');
            let loadIcon = document.createElement('i');
            loadIcon.classList.add('material-icons');
            loadIcon.classList.add('load-icon');
            loadIcon.innerHTML = 'archive';
            loadCell.appendChild(loadIcon);
            row.appendChild(loadCell);

            let deleteCell = document.createElement('td');
            let deleteIcon = document.createElement('i');
            deleteIcon.setAttribute("name", saveName);
            deleteIcon.classList.add('material-icons');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.innerHTML = 'delete';
            deleteIcon.addEventListener('click', deleteSave);
            deleteCell.appendChild(deleteIcon);
            row.appendChild(deleteCell);

            savesTableBody.appendChild(row);
        }
    };

    refreshTable();
};

const init = async () => {
    jsonEditorInit();
    downloaderInit();
    uploadInit();
    localStorageInit();
}

export default init;