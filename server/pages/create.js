import getEditor from "/web/json-editor.js";
import { list } from "/common/shapes/shapes.js";

console.log(list);

window.addEventListener("load", async () => {
    const container = document.getElementById("json");

    const oldShapeDataSchema = {
        title: "Data",
        description: "The data that the shape stores as json.",
        properties: {
            fillColor: {
                $ref: "color"
            },
            strokeColor: {
                $ref: "color"
            },
            strokeWidth: {
                title: "Stroke Width",
                description: "The width of lines in the canvas.",
                type: "number",
                minimum: 0
            },
            animations: {
                title: "Animations",
                description: "An array of animations that are applied to the shape.",
                type: "array",
                items: {
                    title: "Animation",
                    description: "An animation animates the properties of a shape.",
                    properties: {
                        startTime: {
                            title: "Start Time",
                            description: "The time the animation is applied.",
                            type: "number",
                            minimum: 0
                        },
                        duration: {
                            title: "Duration",
                            description: "The amount of time the animation lasts",
                            type: "number",
                            minimum: 0
                        },
                        isBuiltin: {
                            title: "Is Builtin",
                            description: "Whether or not the animation is the builtin canvideo animation.",
                            type: "boolean"
                        },
                        name: {
                            title: "Name",
                            description: "The name of the animation.",
                            type: "string"
                        },
                        lasts: {
                            title: "Lasts",
                            description: "Whether the final values of animation still effect the shape after the animation ends.",
                            type: "boolean"
                        }
                    },
                    if: {
                        properties: { isBuiltin: { const: true } }
                    },
                    then: {
                        properties: {
                            name: {
                                title: "Name",
                                description: "The name of the builtin animation.",
                                enum: ["animation", "precomputed"]
                            }
                        },
                        allOf: [
                            {
                                if: {
                                    properties: { name: { const: "animation" } }
                                },
                                then: {
                                    properties: {
                                        data: {
                                            title: "Animation Data",
                                            description: "Data about the animation",
                                            properties: {
                                                startValue: {
                                                    title: "Start Value",
                                                    description: "Value at the beginning of the animation.",
                                                    type: "object"
                                                },
                                                endValue: {
                                                    title: "End Value",
                                                    description: "Value at the end of the animation.",
                                                    type: "object"
                                                },
                                                reversed: {
                                                    title: "Reversed",
                                                    description: "Wether or not the animation is reversed.",
                                                    type: "boolean"
                                                }
                                            },
                                            required: ["startValue", "endValue", "reversed"]
                                        }
                                    }
                                }
                            },
                            {
                                if: {
                                    properties: { name: { const: "precomputed" } }
                                },
                                then: {
                                    properties: {
                                        data: {
                                            title: "Precomputed Data",
                                            description: "Data about the precomputed values",
                                            type: "array",
                                            items: {
                                                title: "Value",
                                                description: "A tuple with the value at a certain time.",
                                                type: "array",
                                                items: [
                                                    {
                                                        title: "At",
                                                        description: "Time at which value changes.",
                                                        type: "number",
                                                        minimum: 0
                                                    },
                                                    {
                                                        title: "Value",
                                                        description: "The properties that change.",
                                                        type: "object"
                                                    }
                                                ],
                                                minItems: 2,
                                                additionalItems: false
                                            }
                                        }
                                    }
                                }
                            }
                        ],
                        required: ["name", "data"]
                    },
                    else: {
                        properties: {
                            data: {
                                $ref: "any"
                            }
                        }
                    },
                    required: ["startTime", "duration", "isBuiltin", "lasts"]
                }
            }
        },
        required: ["animations", "sets"]
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
            shape: {
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
                            enum: ["shape"]
                        }
                    },
                    required: ["name", "data"]
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
        },
        required: ["startTime", "endTime", "layer", "shape"]
    }

    const sceneSchema = {
        title: "Scene",
        description: "A scene containing shapes that can be animated.",
        properties: {
            backgroundColor: {
                $ref: "color"
            },
            drawables: {
                title: "Drawables",
                description: "Drawables in a scene.",
                type: "array",
                items: drawableSchema
            }
        },
        required: ["backgroundColor", "drawables"]
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

    const colorSchema = {
        title: "Color",
        description: "Color hex string.",
        type: "string",
        pattern: "^#?([0-9a-fA-F]{2}){3,4}$"
    }

    const anySchema = {
        title: "Any",
        description: "Anything is fine.",
        type: [
            "number",
            "string",
            "boolean",
            "object",
            "array",
            "null"]
    }

    const options = {
        schema: schema,
        schemaRefs: {
            color: colorSchema,
            any: anySchema
        },
        mode: 'code',
        modes: ['code', 'tree']
    }
    const initialJson = {
        width: 400,
        height: 400,
        fps: 24,
        scenes: [{
            backgroundColor: "#1e90ff",
            drawables: [
                {
                    startTime: 0,
                    endTime: 10,
                    layer: 0,
                    shape: {
                        isBuiltin: true,
                        name: "rectangle"
                    }
                }
            ]
        }]
    }

    let JsonEditor = await getEditor();

    const editor = new JsonEditor(container, options, initialJson);
});