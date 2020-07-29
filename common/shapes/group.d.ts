import Shape from "./shape";
import { ShapeProperties, ShapeJson } from "./shape-properties";
import { caMappings } from "../animations/animanaged";

type shape = Shape<any, any>;

interface GroupProperties extends ShapeProperties {
    children: Array<shape>;
    x: number;
    y: number;
    originalWidth: number;
    originalHeight: number;
    refX: number;
    refY: number;
    width: number;
    height: number;
}

interface ChildJson {
    isBuiltin: boolean;
    name: string | undefined;
    data: object;
}

interface GroupJson extends ShapeJson<GroupProperties> {
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

type groupCaMappings = caMappings<GroupProperties>;

declare class Group extends Shape<Group, GroupProperties>{
    static shapeName: string | "group";

    static fromJson(json: string, parse?: true, throwErrors?: false, caMappings?: groupCaMappings): Group | false;
    static fromJson(json: any, parse: false, throwErrors?: false, caMappings?: groupCaMappings): Group | false;
    static fromJson(json: string, parse: true, throwErrors: true, caMappings?: groupCaMappings): Group;
    static fromJson(json: any, parse: false, throwErrors: true, caMappings?: groupCaMappings): Group;

    static fromJson(...args: any): any;

    constructor(x?: number, y?: number, originalWidth?: number, originalHeight?: number, refX?: number, refY?: number);

    shapeName: string | "group";
    children: Array<shape>;
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

    add(drawable: shape): this;

    toJson(stringify?: true, fps?: number): string;
    toJson(stringify: false, fps?: number): GroupJson;

    toJson(...args: any): any;
}

export default Group;