export default {
    input: "index.js",
    output: {
        file: "commonjs/index.js",
        format: "cjs"
    },
    external: [
        "fs",
        "path",
        "child_process",
        "express",
        "canvas",
        "tinycolor2",
        "eventemitter3"
    ]
}