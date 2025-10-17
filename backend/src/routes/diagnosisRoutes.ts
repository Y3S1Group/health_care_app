import { Router } from 'express';
import { DiagnosisController } from '../controllers/DiagnosisController';
import { DiagnosisRepository } from '../repositories/DiagnosisRepository';
import { UserRepository } from '../repositories/UserRepository';
import { DiagnosisService } from '../services/DiagnosisService';
import { validate } from '../middleware/validator';
import { 
  createDiagnosisSchema, 
  createDiagnosisByCustomIdSchema,  // NEW
  updateDiagnosisSchema 
} from '../validators/diagnosisSchemas';
import { auth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// Setup dependencies
const diagnosisRepo = new DiagnosisRepository();
const userRepo = new UserRepository();
const diagnosisService = new DiagnosisService(diagnosisRepo, userRepo);
const diagnosisController = new DiagnosisController(diagnosisService);

// ===== NEW ROUTES USING CUSTOM USER ID =====

// Create diagnosis using custom userId
router.post(
  '/by-custom-id',
  auth,
  requireRole(['doctor', 'admin']),
  validate(createDiagnosisByCustomIdSchema),
  diagnosisController.createDiagnosisByCustomUserId
);

// Get diagnoses by custom userId
router.get(
  '/by-custom-id/:customUserId',
  auth,
  requireRole(['doctor', 'nurse', 'admin']),
  diagnosisController.getDiagnosesByCustomUserId
);

// ===== EXISTING ROUTES (Keep these for backward compatibility) =====

router.post(
  '/',
  auth,
  requireRole(['doctor', 'admin']),
  validate(createDiagnosisSchema),
  diagnosisController.createDiagnosis
);

router.get(
  '/:id',
  auth,
  requireRole(['doctor', 'nurse', 'admin']),
  diagnosisController.getDiagnosisById
);

router.get(
  '/patient/:patientId',
  auth,
  requireRole(['doctor', 'nurse', 'admin']),
  diagnosisController.getDiagnosesByPatientId
);

router.put(
  '/:id',
  auth,
  requireRole(['doctor', 'admin']),
  validate(updateDiagnosisSchema),
  diagnosisController.updateDiagnosis
);

router.delete(
  '/:id',
  auth,
  requireRole(['doctor', 'admin']),
  diagnosisController.deleteDiagnosis
);

export default router;