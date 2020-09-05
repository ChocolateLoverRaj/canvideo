class Shortcut {
    constructor(name, key) {
        this.name = name;
        this.default = key;
        this._custom = null;
    }

    get custom() {
        return this._custom ?? (this._custom = {
            ctrl: this.default.ctrl,
            shift: this.default.shift,
            alt: this.default.alt,
            key: this.default.key
        });
    }

    set ctrl(v) {
        this.custom.ctrl = v;
    }
    get ctrl() {
        return this._custom?.ctrl ?? this.default.ctrl;
    }

    set shift(v) {
        this.custom.shift = v;
    }
    get shift() {
        return this._custom?.shift ?? this.default.shift;
    }

    set alt(v) {
        this.custom.alt = v;
    }
    get alt() {
        return this._custom?.alt ?? this.default.alt;
    }

    set key(v) {
        this.custom.key = v;
    }
    get key() {
        return this.custom?.key ?? this.default.key;
    }

    reset() {
        this._custom = null;
    }
}

const shortcuts = [
    new Shortcut("Show Keyboard Shortcuts", {
        ctrl: true,
        shift: false,
        alt: false,
        key: "q"
    }),
    new Shortcut("Save", {
        ctrl: true,
        shift: false,
        alt: false,
        key: "s"
    }),
    new Shortcut("Save As", {
        ctrl: true,
        shift: true,
        alt: false,
        key: "s"
    }),
    new Shortcut("Load Save", {
        ctrl: true,
        shift: false,
        alt: false,
        key: "o"
    }),
    new Shortcut("Open Settings", {
        ctrl: true,
        shift: false,
        alt: false,
        key: "p"
    }),
    new Shortcut("Download", {
        ctrl: true,
        shift: false,
        alt: false,
        key: "d"
    }),
    new Shortcut("Upload", {
        ctrl: true,
        shift: false,
        alt: false,
        key: "u"
    })
];

export default shortcuts;