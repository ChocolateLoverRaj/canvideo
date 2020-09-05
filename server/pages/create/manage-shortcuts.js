import shortcuts from "./shortcuts-list.js";

var tbody;

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
                selecting = true;
                keySpan.classList.add("selecting");

                const stopSelecting = () => {
                    removeEventListener('keydown', keydownListener);
                    removeEventListener('click', clickListener);
                    keySpan.removeEventListener('click', spanClickListener);

                    selecting = false;
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
    }
};

const init = () => {
    tbody = document.getElementById("modals__shortcuts__tbody");

    refresh();
};

export default init;