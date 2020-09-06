import { addValidator } from "../ls.js";

addValidator("settings", item => {
    item.parseJson();
    if (!(
        item.data?.autoSave === false ||
        (
            Number.isSafeInteger(item.data?.autoSave?.frequency) &&
            item.data.autoSave.frequency >= 1 &&
            item.data.autoSave.frequency <= 3600
        )
    )) {
        item.data = {
            autoSave: false
        };
        item.save();
    }
});