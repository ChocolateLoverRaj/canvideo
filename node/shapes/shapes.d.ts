import Shape from "./shape";
import Rectangle from "./rectangle";
import Group from "./group";
import Circle from "./circle";
import Polygon from "./polygon";
import NumberLine from "./number-line";
import Path from "./path";
import csMappings from "./cs-mappings";
import { caMappings } from "../animations/animanaged";

export const list: Array<Function>;

export function isBuiltin(shape: any): boolean;

type anyShapeCam = caMappings<any>;

export function fromJson(name: "shape", data: any, parse?: boolean, throwErrors?: boolean, csMappings?: csMappings, caMappings?: anyShapeCam): Shape<any, any>;
export function fromJson(name: "rectangle", data: any, parse?: boolean, throwErrors?: boolean, csMappings?: csMappings, caMappings?: anyShapeCam): Rectangle;
export function fromJson(name: "group", data: any, parse?: boolean, throwErrors?: boolean, csMappings?: csMappings, caMappings?: anyShapeCam): Group;
export function fromJson(name: "circle", data: any, parse?: boolean, throwErrors?: boolean, csMappings?: csMappings, caMappings?: anyShapeCam): Circle;
export function fromJson(name: "polygon", data: any, parse?: boolean, throwErrors?: boolean, csMappings?: csMappings, caMappings?: anyShapeCam): Polygon;
export function fromJson(name: "numberLine", data: any, parse?: boolean, throwErrors?: boolean, csMappings?: csMappings, caMappings?: anyShapeCam): NumberLine;
export function fromJson(name: "path", data: any, parse?: boolean, throwErrors?: boolean, csMappings?: csMappings, caMappings?: anyShapeCam): Path;