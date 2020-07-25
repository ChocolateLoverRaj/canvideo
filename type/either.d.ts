import type from "./type";

declare function either(type: type, ...types: Array<type>): type;

export default either;