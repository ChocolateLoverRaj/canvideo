import { editor } from "./json-editor.js";

//Download button
var downloadButton;

const onclickListener = () => {
    let blob = new Blob([editor.getText()], { type: "application/json;charset=utf-8" });
    downloadButton.setAttribute('href', URL.createObjectURL(blob));
};

const init = () => {
    downloadButton = document.getElementById("menu__export__download");
    downloadButton.addEventListener('click', onclickListener);
};

export default init;