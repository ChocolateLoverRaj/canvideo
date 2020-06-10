import type = require("./type");

declare function either(type: type, ...types: type): type;

export = either;