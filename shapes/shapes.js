//Quick way of getting shapes

//Dependencies
const Shape = require("./shape");
const Rectangle = require("./rectangle");
const Group = require("./group");
const Circle = require("./circle");
const Polygon = require("./polygon");
const NumberLine = require("./number-line");
const Path = require("./path");
const {typedFunction, Types, instanceOf} = require("../type");

//Shapes module
const shapes = { Shape, Rectangle, Group, Circle, Polygon, NumberLine, Path };

//List of shapes
shapes.list = [Shape, Rectangle, Group, Circle, Polygon, NumberLine, Path];

//Check if a shape is builtin or not
shapes.isBuiltin = function(shape){
    for(var builtinShape of shapes.list){
        if(Object.getPrototypeOf(shape) === builtinShape.prototype){
            return true;
        }
    }
    return false;
}
    
//Get a shape from json
shapes.fromJson = typedFunction([
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
], function(name, json, parse = true, throwErrors = false, csMappings = new Map(), caMappings = new Map()){
    if(typeof json === 'string' && parse){
        try{
            json = JSON.parse(json);
        }
        catch(e){
            if(throwErrors){
                throw e;
            }
            else{
                return false;
            }
        }
    }
    else if(parse){
        throw new TypeError("Cannot parse non string json.");
    }
    try{
        for(var shape of shapes.list){
            if(name === shape.shapeName){
                switch(name){
                    case Group.shapeName:
                        return shape.fromJson(json, false, true, caMappings, csMappings);
                    default:
                        return shape.fromJson(json, false, true, caMappings);
                }
            }
        }
        throw new TypeError(`Unknown shape: ${name}.`);
    }
    catch(e){
        if(throwErrors){
            throw e;
        }
        else{
            return false;
        }
    }
});

//Export the module
module.exports = shapes;