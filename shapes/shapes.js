//Quick way of getting shapes

//Dependencies
const Shape = require("./shape");
const Rectangle = require("./rectangle");
const Group = require("./group");
const Circle = require("./circle");
const Polygon = require("./polygon");
const NumberLine = require("./number-line");
const Path = require("./path");
const {typedFunction, Types} = require("../type");

//Shapes module
const shapes = { Shape, Rectangle, Group, Circle, Polygon, NumberLine, Path };

//List of shapes
shapes.list = [Shape, Rectangle, Group, Circle, Polygon, NumberLine, Path];

//Check if a shape is builtin or not
shapes.isBuiltin = function(shape){
    for(var builtinShape of shapes.list){
        if(shape instanceof builtinShape){
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
    }
], function(name, json, parse = true, throwErrors = false){
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
                //TODO Make the fromJson function for other shapes, too.
                return shape.fromJson(json, false, true);
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