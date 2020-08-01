import getEditor from "/web/json-editor.js";
import {
    options as jsonSchemaOptions,
    initialJson
} from "./json-schema.js";

const options = {
    ...jsonSchemaOptions,
    mode: 'code',
    modes: ['code', 'tree'],
    search: false
}

const editorPromise = getEditor();
var editor;
const jsonEditorInit = async () => {
    const container = document.getElementById("json__editor");
    let JsonEditor = await editorPromise;
    editor = new JsonEditor(container, options, initialJson);
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

const localStorageInit = () => {
    var saves;
    var confirmDeleteListener;
    var duplicateOverwriteListener;

    const savesForm = document.getElementById("local-storage__form");
    const savesTableBody = document.getElementById("local-storage__table__body");
    const confirmDeleteCheckbox = document.getElementById("local-storage__confirm-delete__checkbox");
    const confirmDeleteName = document.getElementById("local-storage__confirm-delete__name");
    const confirmDeleteConfirm = document.getElementById("local-storage__confirm-delete__confirm");
    const duplicateCheckbox = document.getElementById("local-storage__duplicate-modal__checkbox");
    const duplicateName = document.getElementById("local-storage__duplicate-modal__name");
    const duplicateOverwrite = document.getElementById("local-storage__duplicate-modal__overwrite");

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
        saves = savesString ? JSON.parse(savesString) : { saves: {}, selected: null };
        savesTableBody.innerHTML = '';

        //TODO make a toggle input for auto-saving. Maybe add another input for auto-save frequency.
        //TODO listen for json updates and Ctrl+S.
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
                if(saves.selected === name){
                    saves.selected = null;
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