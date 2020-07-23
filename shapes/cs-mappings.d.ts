import Shape from "./shape";
import { caMappings } from "../animations/animanaged";

declare type fromJson = (data?: any, parse?: any & false, throwErrors?: any & true, csMappings?: any & csMappings, caMappings?: any & caMappings<any>) => Shape<any, any>;

declare type csMappings = Map<string, fromJson>;

export = csMappings;