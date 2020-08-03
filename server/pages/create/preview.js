import { getEditorText } from "./json-editor.js";

export const init = () => {
    const canvas = document.getElementById("preview__canvas");
    const ctx = canvas.getContext('2d');

    const PreviewErrors = {
        BAD_JSON: document.getElementById("preview__errors__bad-json")
    };

    const showError = errElem => {
        for(let k in PreviewErrors){
            let v = PreviewErrors[k];
            v.classList.add("hidden");
        }
        errElem.classList.remove("hidden");
    }
    
    let text = getEditorText();
    let videoJson;
    try {
        videoJson = JSON.parse(text);
        console.log("good json.");
    }
    catch{
        showError(PreviewErrors.BAD_JSON);
    }
};