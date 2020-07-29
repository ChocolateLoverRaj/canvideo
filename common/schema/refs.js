export const refs = new Map();

export const addRef = (v) => {
    let refsSize = refs.size.toString();
    refs.set(refsSize, v);
    return refsSize;
};

export const setRef = (k, v) => {
    refs.set(k, v);
}