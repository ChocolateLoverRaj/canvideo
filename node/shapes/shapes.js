//Quick way of getting shapes

//Dependencies
import Shape from "./shape.js";
import Rectangle from "./rectangle.js";
import Group from "./group.js";
import Circle from "./circle.js";
import Polygon from "./polygon.js";
import NumberLine from "./number-line.js";
import Path from "./path.js";
import typedFunction from "../../common/type/typed-function.js";
import Types from "../../common/type/types.js";
import instanceOf from "../../common/type/instanceOf.js";

//List of shapes
export const list = [Shape, Rectangle, Group, Circle, Polygon, NumberLine, Path];

//Check if a shape is builtin or not
export const isBuiltin = shape => {
    for (var builtinShape of list) {
        if (Object.getPrototypeOf(shape) === builtinShape.prototype) {
            return true;
        }
    }
    return false;
}

//Get a shape from json
export const fromJson = typedFunction([
    {
        name: "name",
        type: Types.STRING
    },
    {
        name: "data",
        type: Types.ANY
    },
    {
        name: "parse",
        type: Types.BOOLEAN,
        optional: true
    },
    {
        name: "throwErrors",
        type: Types.BOOLEAN,
        optional: true
    },
    {
        name: "csMappings",
        type: instanceOf(Map),
        optional: true
    },
    {
        name: "caMappings",
        type: instanceOf(Map),
        optional: true
    }
], function (name, json, parse = true, throwErrors = false, csMappings = new Map(), caMappings = new Map()) {
    if (typeof json === 'string' && parse) {
        try {
            json = JSON.parse(json);
        }
        catch (e) {
            if (throwErrors) {
                throw e;
            }
            else {
                return false;
            }
        }
    }
    else if (parse) {
        throw new TypeError("Cannot parse non string json.");
    }
    try {
        for (var shape of list) {
            if (name === shape.shapeName) {
                switch (name) {
                    case Group.shapeName:
                        return shape.fromJson(json, false, true, caMappings, csMappings);
                    default:
                        return shape.fromJson(json, false, true, caMappings);
                }
            }
        }
        throw new TypeError(`Unknown shape: ${name}.`);
    }
    catch (e) {
        if (throwErrors) {
            throw e;
        }
        else {
            return false;
        }
    }
});