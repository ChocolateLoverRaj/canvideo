window.addEventListener("load", () => {
    let event = new CustomEvent("jsonEditor", { detail: JSONEditor });
    window.dispatchEvent(event);
});