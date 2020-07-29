const promise = new Promise((resolve, reject) => {
    window.addEventListener("jsonEditor", ({ detail }) => {
        resolve(detail);
    });
});

export default async () => promise;