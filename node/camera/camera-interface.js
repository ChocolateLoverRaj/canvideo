//Interface for camera

//Dependencies
import { Interface } from "../../common/type/interface.js";
import Types from "../../common/type/types.js";

//Camera interface
const cameraInterface = new Interface(true)
    .required("scaleX", Types.NUMBER)
    .required("scaleY", Types.NUMBER)
    .required("refX", Types.NUMBER)
    .required("refY", Types.NUMBER)
    .required("x", Types.NUMBER)
    .required("y", Types.NUMBER)
    .toType();

export default cameraInterface;