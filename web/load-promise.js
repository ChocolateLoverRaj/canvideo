export default Promise((resolve, reject) => {
    document.addEventListener('load', () => {
        resolve();
    });
});