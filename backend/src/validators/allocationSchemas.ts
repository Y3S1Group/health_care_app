import Joi from 'joi';

export const allocateSchema = Joi.object({
    hospitalID: Joi.string().required().uppercase().messages({
        'string.empty': 'Hospital ID is required',
        'any.required': 'Hospital ID is required'
    }),
    department: Joi.string().required().uppercase().messages({
        'string.empty': 'Department is required',
        'any.required': 'Department is required'
    }),
    staffIds: Joi.array().items(Joi.string().uppercase()).min(1).required().messages({
        'array.min': 'At least one staff member is required',
        'any.required': 'Staff IDs are required'
    }),
    bedCount: Joi.number().integer().min(0).required().messages({
        'number.base': 'Bed count must be a number',
        'number.min': 'Bed count cannot be negative',
        'any.required': 'Bed count is required'
    }),
    equipment: Joi.array().items(Joi.string()).default([])
});


export const reallocateSchema = Joi.object({
    staffId: Joi.array().items(Joi.string().uppercase()).min(1).optional(),
    bedCount: Joi.number().integer().min(0).optional(),
    equipment: Joi.array().items(Joi.string()).optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for reallocation'
})