import tinyColor from "./tiny-color.js"

export const hexStringSchema = {
    title: "Color",
    description: "Color hex string.",
    type: "string",
    pattern: "^#?([0-9a-fA-F]{2}){3,4}$"
}

export const cssColorNameSchema = {
    title: "Css Color Name",
    description: "Many English words, such as 'pink', are standard css color names.",
    enum: Object.keys(tinyColor.names)
}

export const colorSchema = {
    title: "Color",
    description: "A valid css color.",
    anyOf: [
        hexStringSchema,
        cssColorNameSchema
    ]
}