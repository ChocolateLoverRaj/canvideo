module.exports = {
    inputDir: "./commonignore",
    outputDir: "./",
    files: {
        "git.gitignore": {
            extends: ["common.gitignore"],
            output: ".gitignore"
        },
        "npm.npmignore": {
            extends: ["common.gitignore"],
            output: ".npmignore"
        }
    }
};