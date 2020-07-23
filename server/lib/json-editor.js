const promise = new Promise((resolve, reject) => {
    window.addEventListener("jsonEditor", ({ detail }) => {
        resolve(detail);
    });
});

export const getEditor = async () => promise;

export default getEditor;