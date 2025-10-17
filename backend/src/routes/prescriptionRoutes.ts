import { Router } from 'express';
import { PrescriptionController } from '../controllers/PrescriptionController';
import { PrescriptionRepository } from '../repositories/PrescriptionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { PrescriptionService } from '../services/PrescriptionService';
import { validate } from '../middleware/validator';
import { 
  createPrescriptionSchema, 
  createPrescriptionByCustomIdSchema,  // NEW
  updatePrescriptionSchema 
} from '../validators/prescriptionSchemas';
import { auth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// Setup dependencies
const prescriptionRepo = new PrescriptionRepository();
const userRepo = new UserRepository();
const prescriptionService = new PrescriptionService(prescriptionRepo, userRepo);
const prescriptionController = new PrescriptionController(prescriptionService);

// ===== NEW ROUTES USING CUSTOM USER ID =====

// Create prescription using custom userId
router.post(
  '/by-custom-id',
  auth,
  requireRole(['doctor', 'admin']),
  validate(createPrescriptionByCustomIdSchema),
  prescriptionController.createPrescriptionByCustomUserId
);

// Get all prescriptions by custom userId
router.get(
  '/by-custom-id/:customUserId',
  auth,
  requireRole(['doctor', 'nurse', 'admin']),
  prescriptionController.getPrescriptionsByCustomUserId
);

// Get active prescriptions by custom userId
router.get(
  '/by-custom-id/:customUserId/active',
  auth,
  requireRole(['doctor', 'nurse', 'admin']),
  prescriptionController.getActivePrescriptionsByCustomUserId
);

// ===== EXISTING ROUTES (Keep these for backward compatibility) =====

router.post(
  '/',
  auth,
  requireRole(['doctor', 'admin']),
  validate(createPrescriptionSchema),
  prescriptionController.createPrescription
);

router.get(
  '/:id',
  auth,
  requireRole(['doctor', 'nurse', 'admin']),
  prescriptionController.getPrescriptionById
);

router.get(
  '/patient/:patientId',
  auth,
  requireRole(['doctor', 'nurse', 'admin']),
  prescriptionController.getPrescriptionsByPatientId
);

router.get(
  '/patient/:patientId/active',
  auth,
  requireRole(['doctor', 'nurse', 'admin']),
  prescriptionController.getActivePrescriptionsByPatientId
);

router.put(
  '/:id',
  auth,
  requireRole(['doctor', 'admin']),
  validate(updatePrescriptionSchema),
  prescriptionController.updatePrescription
);

router.delete(
  '/:id',
  auth,
  requireRole(['doctor', 'admin']),
  prescriptionController.deletePrescription
);

export default router;