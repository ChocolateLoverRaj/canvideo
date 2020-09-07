//Detects shortcuts
import keyRegex from "./key-regex.js";
import shortcuts from "./shortcuts-list.js";
import { EventEmitter } from "/common/event-emitter/event-emitter.js";

const shortcutsEmitter = new EventEmitter();

addEventListener('keydown', e => {
    if (keyRegex.test(e.key)) {
        for (const shortcut of shortcuts) {
            if (
                e.key.toLowerCase() === shortcut.key &&
                e.ctrlKey === shortcut.ctrl &&
                e.shiftKey === shortcut.shift &&
                e.altKey === shortcut.alt
            ) {
                e.preventDefault();

                shortcutsEmitter.emit(shortcut.shortcutName);
            }
        }
    }
});

export default shortcutsEmitter;