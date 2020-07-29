import captionJson from "../captions/caption-json"

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
    captions: CaptionsJson;
}

export default interface SceneJson {
    backgroundColor: string;
    drawables: Array<DrawableJson>;
    captions: CaptionsJson;
}