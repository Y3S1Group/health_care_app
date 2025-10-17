import Joi from 'joi';

export const createPatientProfileSchema = Joi.object({
  userId: Joi.string().required(),
  temperature: Joi.number().min(35).max(45).optional(),
  bloodPressure: Joi.string().pattern(/^\d{2,3}\/\d{2,3}$/).optional(),
  heartRate: Joi.number().min(30).max(200).optional(),
  totalCharges: Joi.number().min(0).optional(),
  paidAmount: Joi.number().min(0).optional(),
  outstanding: Joi.number().min(0).optional(),
  insuranceProvider: Joi.string().max(100).optional(),
  policyNumber: Joi.string().max(50).optional(),
  groupNumber: Joi.string().max(50).optional(),
  dischargeDate: Joi.date().optional(),
  attendingPhysician: Joi.string().max(100).optional(),
  dischargeSummary: Joi.string().optional(),
});

export const updatePatientProfileSchema = Joi.object({
  temperature: Joi.number().min(35).max(45).optional(),
  bloodPressure: Joi.string().pattern(/^\d{2,3}\/\d{2,3}$/).optional(),
  heartRate: Joi.number().min(30).max(200).optional(),
  totalCharges: Joi.number().min(0).optional(),
  paidAmount: Joi.number().min(0).optional(),
  outstanding: Joi.number().min(0).optional(),
  insuranceProvider: Joi.string().max(100).optional(),
  policyNumber: Joi.string().max(50).optional(),
  groupNumber: Joi.string().max(50).optional(),
  dischargeDate: Joi.date().optional(),
  attendingPhysician: Joi.string().max(100).optional(),
  dischargeSummary: Joi.string().optional(),
});