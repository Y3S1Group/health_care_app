import Joi from 'joi';

// Existing schema
export const createPrescriptionSchema = Joi.object({
  patientId: Joi.string().required(),
  medicationName: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  instructions: Joi.string().required(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

// NEW: Schema for custom userId
export const createPrescriptionByCustomIdSchema = Joi.object({
  customUserId: Joi.string().required(),
  medicationName: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  instructions: Joi.string().required(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

export const updatePrescriptionSchema = Joi.object({
  medicationName: Joi.string().optional(),
  dosage: Joi.string().optional(),
  frequency: Joi.string().optional(),
  instructions: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});