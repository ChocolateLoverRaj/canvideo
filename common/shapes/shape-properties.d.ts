import { AnimationJson, SetJson } from "../animations/animanaged";

export interface ShapeJson<P extends {}> {
    fillColor: string | undefined;
    strokeColor: string | undefined;
    strokeWidth: number | undefined;
    animations: Array<AnimationJson>;
    sets: Array<SetJson<P>>;
}

export interface ShapeProperties {
    fillColor: setColor | GetColor | undefined;
    strokeColor: setColor | GetColor | undefined;
    strokeWidth: number | undefined;
}