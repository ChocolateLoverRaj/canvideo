import shortcuts from "./shortcuts-list.js";

var tbody;
var resetButton;

const keyRegex = /^[a-z]$/i;

const refresh = () => {
    tbody.innerHTML = '';

    for (const shortcut of shortcuts) {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);

        const actionTd = document.createElement('td');
        tr.appendChild(actionTd);
        actionTd.innerText = shortcut.name;

        const ctrlTd = document.createElement('td');
        tr.appendChild(ctrlTd);

        const ctrlI = document.createElement('i');
        ctrlTd.appendChild(ctrlI);
        ctrlI.classList.add('material-icons');
        ctrlI.innerText = shortcut.ctrl ? "check" : "close";

        const shiftTd = document.createElement('td');
        tr.appendChild(shiftTd);

        const shiftI = document.createElement('i');
        shiftTd.appendChild(shiftI);
        shiftI.classList.add('material-icons');
        shiftI.innerText = shortcut.shift ? "check" : "close";

        const altTd = document.createElement('td');
        tr.appendChild(altTd);

        const altI = document.createElement('i');
        altTd.appendChild(altI);
        altI.classList.add('material-icons');
        altI.innerText = shortcut.alt ? "check" : "close";

        const keyTd = document.createElement('td');
        tr.appendChild(keyTd);
        keyTd.classList.add("key");

        const keySpan = document.createElement('span');
        keyTd.appendChild(keySpan);
        keySpan.innerText = shortcut.key;

        let selectClick = false;
        keyTd.addEventListener('click', () => {
            if (!selectClick) {
                keySpan.classList.add("selecting");

                const stopSelecting = () => {
                    removeEventListener('keydown', keydownListener);
                    removeEventListener('click', clickListener);
                    keySpan.removeEventListener('click', spanClickListener);

                    keySpan.classList.remove("selecting");
                }

                const keydownListener = e => {
                    e.preventDefault();

                    if (keyRegex.test(e.key)) {
                        shortcut.ctrl = e.ctrlKey;
                        shortcut.shift = e.shiftKey;
                        shortcut.alt = e.altKey;
                        shortcut.key = e.key.toLowerCase();

                        stopSelecting();
                        refresh();
                    }
                };

                addEventListener('keydown', keydownListener);

                //The first click is this same click
                let firstClick = true;
                const clickListener = e => {
                    e.preventDefault();

                    if (firstClick) {
                        firstClick = false;
                    }
                    else {
                        stopSelecting();
                    }
                };
                addEventListener('click', clickListener);

                const spanClickListener = () => {
                    selectClick = true;
                };
                keySpan.addEventListener('click', spanClickListener);
            }
            else {
                selectClick = false;
            }
        });

        const resetTd = document.createElement('td');
        tr.appendChild(resetTd);

        const resetI = document.createElement('i');
        resetTd.appendChild(resetI);
        resetI.classList.add('material-icons');
        resetI.classList.add("reset");
        resetI.innerText = "settings_backup_restore";
        resetI.addEventListener('click', () => {
            shortcut.reset();
            refresh();
        });
    }
};

const clickHandler = () => {
    for (const shortcut of shortcuts) {
        shortcut.reset();
    }
    refresh();
};

const init = () => {
    tbody = document.getElementById("modals__shortcuts__tbody");
    resetButton = document.getElementById("modals__reset-all__confirm");
    resetButton.addEventListener('click', clickHandler);

    refresh();
};

export default init;