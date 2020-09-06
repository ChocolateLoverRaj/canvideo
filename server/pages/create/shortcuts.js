//Shortcut related tasks.
import customShortcutsInit from "./custom-shortcuts.js";
import "./detect-shortcuts.js";
import handleInit from "./handle-shortcuts.js";

const init = () => {
    customShortcutsInit();
    handleInit();
};

export default init;