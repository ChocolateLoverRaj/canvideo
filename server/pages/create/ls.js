//ls is kind of like fs, but for localStorage.
//fs stands for file system.
//ls stands for local storage.

//an item in local storage
class Item {
    constructor(key) {
        this.key = key;
        this.parsed = false;
        this.data = localStorage.getItem(key) ?? '';
        this.lastSaved = this.data;
    }

    parseJson() {
        this.parsed = true;
        try {
            this.data = JSON.parse(this.data);
        }
        catch (e) {
            this.data = null;
        }
    }

    save() {
        var changed;
        var stringifiedData;
        if (this.parsed) {
            stringifiedData = JSON.stringify(this.data);
            changed = stringifiedData !== this.lastSaved;
        }
        else {
            changed = this.data !== this.lastSaved;
        }
        if (changed) {
            localStorage.setItem(this.key, (this.lastSaved = this.parsed ? stringifiedData : this.data));
        }
    }
}

const items = new Map();

//Validator functions for specific keys
const validators = new Map();

export const open = key => {
    if (items.has(key)) {
        return items.get(key);
    }
    else {
        const item = new Item(key);
        if (validators.has(key)) {
            validators.get(key)(item);
        }
        items.set(key, item);
        return item;
    }
};

export const addValidator = (key, validator) => {
    validators.set(key, validator);
};