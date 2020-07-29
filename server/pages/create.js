import getEditor from "/web/json-editor.js";
import { list } from "/common/shapes/shapes.js";
import { hexStringSchema } from "/common/color/color-schema.js";
import { refs } from "/common/schema/refs.js";

//FIXME problems with rollup and super with inheriting properties

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
        }
    },
    required: ["backgroundColor", "drawables", "captions"]
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

const options = {
    schema,
    schemaRefs,
    mode: 'code',
    modes: ['code', 'tree']
}
const initialJson = {
    width: 400,
    height: 400,
    fps: 24,
    scenes: [
        {
            backgroundColor: "#1e90ff",
            drawables: [],
            captions: {
                "english": [
                    {
                        start: 4,
                        end: 10,
                        text: "Good morning."
                    }
                ]
            }
        }
    ]
}

window.addEventListener("load", async () => {
    const container = document.getElementById("json");

    let JsonEditor = await getEditor();

    const editor = new JsonEditor(container, options, initialJson);
});