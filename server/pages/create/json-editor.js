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

const init = async () => {
    jsonEditorInit();
    downloaderInit();
    uploadInit();
}

export default init;