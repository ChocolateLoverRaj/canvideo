import Drawable from "../render/drawable";
import { caMappings } from "../animations/animanaged";

declare type fromJson = (data?: any, parse?: any & false, throwErrors?: any & true, csMappings?: any & csMappings, caMappings?: any & caMappings<any>) => Drawable;

declare type csMappings = Map<string, fromJson>;

export = csMappings;