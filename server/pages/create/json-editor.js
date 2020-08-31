import JsonEditor from "/web/json-editor.js";
import {
    options as jsonSchemaOptions,
    initialJson
} from "./json-schema.js";
import { updateVideo } from "./preview.js";

const textChangeHandler = text => {
    updateVideo(text);
};

const options = {
    ...jsonSchemaOptions,
    mode: 'code',
    modes: ['code', 'tree'],
    search: false,
    onChangeText: textChangeHandler
}

var editorContainer;
export var editor;
const jsonEditorInit = () => {
    editorContainer = document.getElementById("json__editor");
    editor = new JsonEditor(editorContainer, options, initialJson);
}

export const setText = text => {
    editor.setText(text);
    textChangeHandler(text);
}

export const getText = () => editor.getText();

const uploadInit = () => {
    const InputErrors = {
        NOT_JSON: "Only files with application/json MIME types will be accepted.",
        READ_ERROR: "Error reading file."
    };

    const uploadInput = document.getElementById("json__upload__input");
    const uploadMessage = document.getElementById("json__upload__message");
    const uploadCheckbox = document.getElementById("json__upload__checkbox");
    const uploadSuccess = document.getElementById("json__upload__success");

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
                textChangeHandler(reader.result);
                uploadSuccess.checked = true;
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

export const init = () => {
    jsonEditorInit();
    uploadInit();
}