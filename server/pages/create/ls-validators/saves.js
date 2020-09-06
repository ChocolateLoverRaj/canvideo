//The 'saves' key and value in local storage.
import { addValidator } from "../ls.js";

addValidator("saves", item => {
    item.parseJson();
    if (!(
        typeof item.data?.saves === 'object' &&
        (() => {
            for (const saveName in item.data.saves) {
                if (
                    saveName.length === 0 ||
                    typeof item.data.saves[saveName] !== 'string'
                ) {
                    console.log("func")
                    return false;
                }
            }
            return true;
        })() &&
        (
            (
                typeof item.data.selected === 'string' &&
                item.data.saves.hasOwnProperty(item.data.selected)
            ) ||
            item.data.selected === null
        )
    )) {
        item.data = {
            saves: {},
            selected: null
        };
        item.save();
    }
});