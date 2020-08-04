import captionJson from "../captions/caption-json";
import CameraJson from "../camera/camera-json";

interface CaptionsJson {
    [key: string]: captionJson;
}

interface DrawableJson {
    startTime: number;
    endTime: number;
    layer: number;
    shape: {
        isBuiltin: boolean;
        name: string | undefined;
        data: object;
    };
}

export default interface SceneJson {
    backgroundColor: string;
    drawables: Array<DrawableJson>;
    captions: CaptionsJson;
    camera: CameraJson;
}