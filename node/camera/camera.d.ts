import Animanaged from "../../common/animations/animanaged";

interface CameraProperties{
    scaleX: number;
    scaleY: number;
    refX: number;
    refY: number;
    x: number;
    y: number;
}

interface CameraJson{
    scaleX: number;
    scaleY: number;
    refX: number;
    refY: number;
    x: number;
    y: number;
}

declare class Camera extends Animanaged<Camera, CameraProperties> {
    constructor();

    static fromJson(json: string, parse?: true, throwErrors?: false): Camera | false;
    static fromJson(json: string, parse: true, throwErrors: true): Camera;
    static fromJson(json: any, parse: false, throwErrors?: false): Camera | false;
    static fromJson(json: any, parse: false, throwErrors: true): Camera;

    scaleX: number;
    scaleY: number;
    refX: number;
    refY: number;
    x: number;
    y: number;

    setScaleX(x: number): this;
    setScaleY(y: number): this;
    setScale(x: number, y: number): this;

    setRefX(x: number): this;
    setRefY(y: number): this;
    setRef(x: number, y: number): this;

    setX(x: number): this;
    setY(y: number): this;
    setPosition(x: number, y: number): this;

    toJson(stringify?: true): string;
    toJson(stringify: false): CameraJson;
}

export default Camera;