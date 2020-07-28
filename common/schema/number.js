//Because this is used by so many shapes
export const numberSchema = {
    type: "number"
};

export const positiveNumberSchema = {
    ...numberSchema,
    exclusiveMinimum: 0
}