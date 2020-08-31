//Load saves from local-storage
import { saves, saveSaves } from "./saves.js";
import { setText } from "./json-editor.js";

var loadCheckbox;

var tbody;

const checkI = document.createElement('i');
checkI.classList.add('material-icons');
checkI.innerText = 'check';

const refreshTable = () => {
    tbody.innerHTML = '';

    for (const saveName in saves.saves) {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);

        const nameTd = document.createElement('td');
        tr.appendChild(nameTd);

        const nameSpan = document.createElement('span');
        nameTd.appendChild(nameSpan);
        nameSpan.innerText = saveName;

        if (saveName === saves.selected) {
            nameTd.appendChild(checkI);
        }

        nameTd.addEventListener('click', () => {
            saves.selected = saveName;
            refreshTable();
            setText(saves.saves[saveName]);
            saveSaves();
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
    loadCheckbox = document.getElementById("modals__load__checkbox");
    loadCheckbox.addEventListener("change", checkHandler);

    tbody = document.getElementById("modals__load__tbody");
};

export default init;