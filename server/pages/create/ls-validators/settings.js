import { addValidator } from "../ls.js";
import shortcuts from "../shortcuts-list.js";
import keyRegex from "../key-regex.js";

addValidator("settings", item => {
    item.parseJson();
    if (!(
        (
            item.data?.autoSave === false ||
            (
                Number.isSafeInteger(item.data?.autoSave?.frequency) &&
                item.data.autoSave.frequency >= 1 &&
                item.data.autoSave.frequency <= 3600
            )
        ) &&
        item.data.shortcuts instanceof Array &&
        item.data.shortcuts.length === shortcuts.length &&
        (() => {
            for (const shortcut of shortcuts) {
                if (!(
                    shortcut === null ||
                    (
                        typeof shortcut?.ctrl === 'boolean' &&
                        typeof shortcut.shift === 'boolean' &&
                        typeof shortcut.alt === 'boolean' &&
                        keyRegex.test(shortcut.key)
                    )
                )) {
                    return false;
                }
            }
            return true;
        })()
    )) {
        item.data = {
            autoSave: false,
            shortcuts: new Array(shortcuts.length).fill(null)
        };
        item.save();
    }
});