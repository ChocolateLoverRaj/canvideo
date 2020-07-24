//Common file for point interface (x, y)

//Dependencies
import { Interface } from "../type/interface.js";
import Types from "../type/types.js";

//Point interface
export default pointInterface = new Interface(false)
    .required("x", Types.NUMBER)
    .required("y", Types.NUMBER)
    .toType();