export const hexStringSchema = {
    title: "Color",
    description: "Color hex string.",
    type: "string",
    pattern: "^#?([0-9a-fA-F]{2}){3,4}$"
}

const rgbSchema = {
    type: "number",
    minimum: 0,
    maximum: 255
}

const aSchema = {
    type: "number",
    minimum: 0,
    maximum: 1
}

export const rgbaSchema = {
    properties: {
        r: rgbSchema,
        g: rgbSchema,
        b: rgbSchema,
        a: aSchema
    },
    allowExtra: false
}