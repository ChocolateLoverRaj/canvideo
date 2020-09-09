import JsonEditor from "/web/json-editor.js";
import {
    options as jsonSchemaOptions,
    initialJson
} from "./json-schema.js";
import { updateVideo } from "./preview.js";
import { autoSave } from "./save.js";

const textChangeHandler = text => {
    updateVideo(text);
    autoSave();
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
export const init = () => {
    editorContainer = document.getElementById("json__editor");
    editor = new JsonEditor(editorContainer, options, initialJson);
    textChangeHandler(editor.getText());
}

export const setText = text => {
    editor.setText(text);
    textChangeHandler(text);
}

export const getText = () => editor.getText();