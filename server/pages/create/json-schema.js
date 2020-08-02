import { list } from "/common/shapes/shapes.js";
import { hexStringSchema } from "/common/color/color-schema.js";
import { refs } from "/common/schema/refs.js";

const shapeNames = [];
const shapeDataSchemas = [];
for (let { shapeName, jsonSchema } of list) {
    shapeNames.push(shapeName);
    shapeDataSchemas.push({
        if: {
            properties: { name: { const: shapeName } }
        },
        then: {
            properties: { data: jsonSchema }
        }
    });
}

const shapeSchema = {
    title: "Shape",
    description: "Details and data of shape.",
    properties: {
        isBuiltin: {
            title: "Is Builtin",
            description: "Whether or not the shape is a builtin canvideo shape.",
            type: "boolean"
        }
    },
    required: ["isBuiltin"],
    if: { properties: { isBuiltin: { const: true } } },
    then: {
        properties: {
            name: {
                title: "Name",
                description: "The name of the builtin shape.",
                enum: shapeNames
            }
        },
        required: ["name", "data"],
        allOf: shapeDataSchemas
    },
    else: {
        properties: {
            name: {
                title: "Name",
                description: "The name of the custom shape.",
                type: "string"
            }
        }
    }
}

const drawableSchema = {
    title: "Drawable",
    description: "A shape with details about start time and end time.",
    properties: {
        startTime: {
            title: "Start Time",
            description: "Time the shape joins the scene.",
            type: "number",
            minimum: 0
        },
        endTime: {
            title: "End Time",
            description: "Time the shape exits the scene.",
            type: "number",
            minimum: 0
        },
        layer: {
            title: "Layer",
            description: "Higher layers get drawn on top of lower levels.",
            type: "number",
            minimum: 0,
            multipleOf: 1
        },
        shape: shapeSchema
    },
    required: ["startTime", "endTime", "layer", "shape"]
}

const sceneSchema = {
    title: "Scene",
    description: "A scene containing shapes that can be animated.",
    properties: {
        backgroundColor: hexStringSchema,
        drawables: {
            title: "Drawables",
            description: "Drawables in a scene.",
            type: "array",
            items: drawableSchema
        },
        captions: {
            title: "Captions",
            description: "The captions that go with the scene.",
            type: "object",
            additionalProperties: {
                title: "Caption",
                description: "A caption track.",
                type: "array",
                items: {
                    title: "Text",
                    description: "A text in a caption.",
                    type: "object",
                    properties: {
                        start: {
                            title: "Start",
                            description: "When the caption appears.",
                            type: "number"
                        },
                        end: {
                            title: "End",
                            description: "When the caption disappears.",
                            type: "number"
                        },
                        text: {
                            title: "Text",
                            description: "The actual text that gets shown.",
                            type: "string"
                        }
                    },
                    required: ["start", "end", "text"]
                }
            }
        },
        camera: {
            title: "Camera",
            description: "The camera that transforms the scene.",
            type: "object",
            properties: {
                scaleX: {
                    title: "Scale X",
                    description: "The horizontal scale.",
                    type: "number"
                },
                scaleY: {
                    title: "Scale Y",
                    description: "The vertical scale.",
                    type: "number"
                },
                refX: {
                    title: "Ref X",
                    description: "The x value that stays the same while scaling.",
                    type: "number"
                },
                refY: {
                    title: "Ref Y",
                    description: "The y value that stays the same while scaling.",
                    type: "number"
                },
                x: {
                    title: "X",
                    description: "The x position of the camera.",
                    type: "number"
                },
                y: {
                    title: "Y",
                    description: "The y position of the camera.",
                    type: "number"
                }
            },
            required: ["scaleX", "scaleY", "refX", "refY", "x", "y"]
        }
    },
    required: ["backgroundColor", "drawables", "captions", "camera"]
}

const schema = {
    title: "Video",
    description: "The video json that will be sent to the server.",
    properties: {
        width: {
            title: "Width",
            description: "Width of video.",
            type: "number",
            multipleOf: 2,
            minimum: 2
        },
        height: {
            title: "Height",
            description: "Height of video.",
            type: "number",
            multipleOf: 2,
            minimum: 2
        },
        fps: {
            title: "Frames Per Second",
            description: "The number of frames per second that the video has.",
            type: "number"
        },
        scenes: {
            title: "Scenes",
            description: "Scenes in the video.",
            type: "array",
            items: sceneSchema
        }
    },
    required: ["width", "height", "fps", "scenes"]
};

const schemaRefs = {};
for (let [k, v] of refs) {
    schemaRefs[k] = v;
}

export const options = {
    schema,
    schemaRefs
}

export const initialJson = {
    width: 400,
    height: 400,
    fps: 24,
    scenes: [
        {
            backgroundColor: "#1e90ff",
            drawables: [],
            captions: {},
            camera: {
                scaleX: 1,
                scaleY: 1,
                refX: 0,
                refY: 0,
                x: 0,
                y: 0
            }
        }
    ]
}