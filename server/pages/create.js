
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
                type: "number"
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
                            $ref: "backgroundColor"
                        }
                    },
                    required: ["backgroundColor", "drawables"]
                }
            }
        },
        required: ["width", "height", "fps", "scenes"]
    };

    const backgroundColorSchema = {
        title: "Background Color",
        description: "Color hex string.",
        type: "string",
        pattern: "^#(?:[0-9a-fA-F]{3}){1,2}$"
    }

    const options = {
        schema: schema,
        schemaRefs: {
            backgroundColor: backgroundColorSchema
        },
        mode: 'code',
        modes: ['code', 'tree']
    }
    const initialJson = {
        "width": 400,
        "height": 400,
        "fps": 24,
        "scenes": [{
            "backgroundColor": "#1e90ff",
            "drawables": []
        }]
    }
    const editor = new JSONEditor(container, options, initialJson);
});