//Upload json files
import { setText } from "./json-editor.js";

var uploadCheckbox;
var uploadForm;
var uploadInvalid;
var uploadError;

var goodMime = true;
const changeHandler = () => {
    const file = uploadForm.input.files[0];

    if (file.type === 'application/json') {
        uploadInvalid.classList.add("hidden");
        goodMime = true;
    }
    else {
        uploadInvalid.classList.remove("hidden");
        goodMime = false;
    }
}

const submitHandler = e => {
    e.preventDefault();

    const file = uploadForm.input.files[0];

    if (goodMime) {
        uploadInvalid.classList.add("hidden");

        const reader = new FileReader();
        reader.addEventListener('error', () => {
            uploadError.checked = true;
        });
        reader.addEventListener('load', () => {
            setText(reader.result);
            uploadCheckbox.checked = false;
        });
        reader.readAsText(file);
    }
}

const init = () => {
    uploadCheckbox = document.getElementById("modals__upload__checkbox");
    uploadForm = document.getElementById("modal__upload__form");
    uploadForm.addEventListener('submit', submitHandler);
    uploadForm.input.addEventListener('change', changeHandler);
    uploadInvalid = document.getElementById("modal__upload__invalid");
    uploadError = document.getElementById("modals__upload-failed__checkbox");
};

export default init;