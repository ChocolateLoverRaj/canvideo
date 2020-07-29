export const hexStringSchema = {
    title: "Color",
    description: "Color hex string.",
    type: "string",
    pattern: "^#?([0-9a-fA-F]{2}){3,4}$"
}