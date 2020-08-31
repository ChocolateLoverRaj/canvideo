//The 'saves' key and value in local storage.

export const saves = localStorage.getItem("saves") !== null ?
    JSON.parse(localStorage.getItem("saves")) :
    {
        saves: {},
        selected: null,
        autoSave: false,
        autoSaveFrequency: 10
    };

export const saveSaves = () => {
    localStorage.setItem("saves", JSON.stringify(saves));
};