import { Shape, ShapeProperties, ShapeJson } from "./shape";
import { caMappings } from "../animations/animanaged";

declare interface GroupProperties extends ShapeProperties<GroupProperties> {
    children: Array<Shape>;
    x: number;
    y: number;
    originalWidth: number;
    originalHeight: number;
    refX: number;
    refY: number;
    width: number;
    height: number;
}

declare interface ChildJson {
    name: string | undefined;
    data: object;
}

declare interface GroupJson extends ShapeJson<GroupProperties> {
    x: number;
    y: number;
    originalWidth: number;
    originalHeight: number;
    refX: number;
    refY: number;
    width: number;
    height: number;
    children: Array<ChildJson>;
}

declare type groupCaMappings = caMappings<GroupProperties>;

declare class Group extends Shape<Group, GroupProperties>{
    static shapeName: "group";

    static fromJson(json: string, parse?: true, throwErrors?: false, caMappings?: groupCaMappings): Group | false;
    static fromJson(json: any, parse: false, throwErrors?: false, caMappings?: groupCaMappings): Group | false;
    static fromJson(json: string, parse?: true, throwErrors: true, caMappings?: groupCaMappings): Group;
    static fromJson(json: any, parse: false, throwErrors: true, caMappings?: groupCaMappings): Group;
    
    constructor(x?: number, y?: number, originalWidth?: number, originalHeight?: number, refX?: number, refY?: number);

    shapeName: "group";
    children: Array<Shape>;
    x: number;
    y: number;
    originalWidth: number;
    originalHeight: number;
    refX: number;
    refY: number;
    width: number;
    height: number;

    setX(x: number): this;
    setY(y: number): this;
    setPosition(x: number, y: number): this;
    setPosition(position: { x: number, y: number }): this;
    setPosition(position: [number, number]): this;

    setOriginalWidth(width: number): this;
    setOriginalHeight(height: number): this;
    setOriginalSize(width: number, height: number): this;
    setOriginalSize(size: { width: number, height: number }): this;
    setOriginalSize(size: [number, number]): this;

    setRefX(x: number): this;
    setRefY(y: number): this;
    setRef(x: number, y: number): this;
    setRef(position: { x: number, y: number }): this;
    setRef(position: [number, number]): this;

    setWidth(width: number): this;
    setHeight(height: number): this;
    setSize(width: number, height: number): this;
    setSize(size: { width: number, height: number }): this;
    setSize(size: [number, number]): this;

    add(drawable: Shape): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): GroupJson;
}

export = Group;