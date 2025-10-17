import Joi from 'joi';

// Existing schema
export const createDiagnosisSchema = Joi.object({
  patientId: Joi.string().required(),
  description: Joi.string().required(),
  diagnosisDate: Joi.date().optional(),
});

// NEW: Schema for custom userId
export const createDiagnosisByCustomIdSchema = Joi.object({
  customUserId: Joi.string().required(),
  description: Joi.string().required(),
  diagnosisDate: Joi.date().optional(),
});

export const updateDiagnosisSchema = Joi.object({
  description: Joi.string().optional(),
  diagnosisDate: Joi.date().optional(),
});