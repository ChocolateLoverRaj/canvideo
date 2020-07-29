import CameraJson from "../camera/camera-json";

export default interface SceneJson {
    backgroundColor: string;
    drawables: Array<DrawableJson>;
    captions: CaptionsJson;
    camera: CameraJson
}