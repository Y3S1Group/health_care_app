import { Router } from 'express';
import { PatientProfileController } from '../controllers/PatientProfileController';
import { PatientProfileRepository } from '../repositories/PatientProfileRepository';
import { UserRepository } from '../repositories/UserRepository';
import { PatientAccessLogRepository } from '../repositories/PatientAccessLogRepository';
import { PatientProfileService } from '../services/PatientProfileService';
import { PatientAccessService } from '../services/PatientAccessService';
import { PatientDataFilterService } from '../services/PatientDataFilterService';
import { validate } from '../middleware/validator';
import { createPatientProfileSchema, updatePatientProfileSchema } from '../validators/patientProfileSchemas';
import { auth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

const patientProfileRepo = new PatientProfileRepository();
const userRepo = new UserRepository();
const accessLogRepo = new PatientAccessLogRepository();

const accessService = new PatientAccessService(accessLogRepo);
const dataFilterService = new PatientDataFilterService();
const patientProfileService = new PatientProfileService(
  patientProfileRepo,
  userRepo,
  accessService,
  dataFilterService
);

const patientProfileController = new PatientProfileController(patientProfileService);


router.get(
  '/search/:patientId',
  auth,
  requireRole(['admin', 'doctor', 'nurse', 'staff', 'manager']),
  patientProfileController.searchPatientByCustomId
);

router.put(
  '/search/:patientId',
  auth,
  requireRole(['admin', 'doctor', 'nurse']),
  validate(updatePatientProfileSchema),
  patientProfileController.updatePatientByCustomId
);

router.get(
  '/access-history/:patientId',
  auth,
  requireRole(['admin', 'doctor']),
  patientProfileController.getPatientAccessHistory
);

// ===== NEW ROUTES USING CUSTOM USER ID =====

// Create profile using custom userId
router.post(
  '/by-custom-id',
  auth,
  requireRole(['admin', 'doctor', 'nurse']),
  validate(createPatientProfileSchema),
  patientProfileController.createProfileByCustomUserId
);

// Get profile by custom userId
router.get(
  '/by-custom-id/:userId',
  auth,
  requireRole(['admin', 'doctor', 'nurse']),
  patientProfileController.getProfileByCustomUserId
);

// Update profile by custom userId
router.put(
  '/by-custom-id/:userId',
  auth,
  requireRole(['admin', 'doctor', 'nurse']),
  validate(updatePatientProfileSchema),
  patientProfileController.updateProfileByCustomUserId
);

// Delete profile by custom userId
router.delete(
  '/by-custom-id/:userId',
  auth,
  requireRole(['admin']),
  patientProfileController.deleteProfileByCustomUserId
);

// ===== EXISTING ROUTES (Keep these) =====

router.post(
  '/',
  auth,
  requireRole(['admin', 'doctor', 'nurse']),
  validate(createPatientProfileSchema),
  patientProfileController.createProfile
);

router.get(
  '/all',
  auth,
  requireRole(['admin', 'doctor', 'nurse']),
  patientProfileController.getAllProfiles
);

router.get(
  '/my-profile',
  auth,
  requireRole(['patient']),
  patientProfileController.getMyProfile
);

router.get(
  '/:userId',
  auth,
  requireRole(['admin', 'doctor', 'nurse']),
  patientProfileController.getProfileByUserId
);

router.put(
  '/:userId',
  auth,
  requireRole(['admin', 'doctor', 'nurse']),
  validate(updatePatientProfileSchema),
  patientProfileController.updateProfile
);

router.delete(
  '/:userId',
  auth,
  requireRole(['admin']),
  patientProfileController.deleteProfile
);

router.get(
  '/:userId/discharge-status',
  auth,
  requireRole(['admin', 'doctor', 'nurse']),
  patientProfileController.checkDischargeStatus
);

export default router;