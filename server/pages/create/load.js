//Load saves from local-storage
import { setText } from "./json-editor.js";
import { open } from "./ls.js";

const savesItem = open("saves");

var savedCheckbox;
var loadCheckbox;
var tbody;

const checkI = document.createElement('i');
checkI.classList.add('material-icons');
checkI.innerText = 'check';

const refreshTable = () => {
    tbody.innerHTML = '';

    for (const saveName in savesItem.data.saves) {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);

        const nameTd = document.createElement('td');
        tr.appendChild(nameTd);

        const nameSpan = document.createElement('span');
        nameTd.appendChild(nameSpan);
        nameSpan.innerText = saveName;

        if (saveName === savesItem.data.selected) {
            nameTd.appendChild(checkI);
        }

        nameTd.addEventListener('click', () => {
            savesItem.data.selected = saveName;
            refreshTable();
            setText(savesItem.data.saves[saveName]);
            savesItem.save();
        });
    }
}

const checkHandler = () => {
    if (loadCheckbox.checked) {
        //Refresh table
        refreshTable();
    }
}

const init = () => {
    savedCheckbox = document.getElementById("save-state__checkbox");

    loadCheckbox = document.getElementById("modals__load__checkbox");
    loadCheckbox.addEventListener("change", checkHandler);

    tbody = document.getElementById("modals__load__tbody");

    if (savesItem.data.selected) {
        setText(savesItem.data.saves[savesItem.data.selected]);
        savedCheckbox.checked = true;
    }
};

export default init;