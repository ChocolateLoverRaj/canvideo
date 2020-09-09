import JsonEditor from "/web/json-editor.js";
import {
    options as jsonSchemaOptions,
    initialJson
} from "./json-schema.js";
import { updateVideo } from "./preview.js";
import { autoSave } from "./save.js";
import { open } from "./ls.js";

const savesItem = open("saves");

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
var savedCheckbox;

export var editor;
export const init = () => {
    editorContainer = document.getElementById("json__editor");
    savedCheckbox = document.getElementById("save-state__checkbox");

    if (savesItem.data.selected) {
        editor = new JsonEditor(editorContainer, options);
        editor.setText(savesItem.data.saves[savesItem.data.selected]);
        savedCheckbox.checked = true;
    }
    else {
        editor = new JsonEditor(editorContainer, options, initialJson);
    }
    updateVideo(editor.getText());
}

export const setText = text => {
    editor.setText(text);
    textChangeHandler(text);
}

export const getText = () => editor.getText();