
window.addEventListener("load", () => {
    const container = document.getElementById("json");

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
                items: {
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
                            items: {
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
                                            },
                                            name: {
                                                title: "Name",
                                                description: "The name of the shape.",
                                                type: "string"
                                            },
                                            data: {
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
                                                                },
                                                                data: {
                                                                    title: "Data",
                                                                    description: "The data about the animation.",
                                                                    anyOf: [
                                                                        { type: "object" }
                                                                    ]
                                                                }
                                                            },
                                                            required: ["startTime", "duration", "isBuiltin", "lasts"]
                                                        }
                                                    }
                                                },
                                                required: ["animations", "sets"]
                                            }
                                        },
                                        required: ["isBuiltin", "data"]
                                    }
                                },
                                required: ["startTime", "endTime", "layer", "shape"]
                            }
                        }
                    },
                    required: ["backgroundColor", "drawables"]
                }
            }
        },
        required: ["width", "height", "fps", "scenes"]
    };

    const colorSchema = {
        title: "Color",
        description: "Color hex string.",
        type: "string",
        pattern: "^#(?:[0-9a-fA-F]{3}){1,2}$"
    }

    const options = {
        schema: schema,
        schemaRefs: {
            color: colorSchema
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
                        name: "rectangle",
                        data: {
                            x: 0,
                            y: 0,
                            width: 200,
                            height: 400,
                            cornerRound: {
                                topLeft: 0,
                                topRight: 0,
                                bottomLeft: 0,
                                bottomRight: 0
                            }
                        }
                    }
                }
            ]
        }]
    }
    const editor = new JSONEditor(container, options, initialJson);
});