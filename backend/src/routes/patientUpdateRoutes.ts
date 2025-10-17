import { Router } from 'express';
import { PatientUpdateController } from '../controllers/PatientUpdateController';
import { PatientUpdateService } from '../services/PatientUpdateService';
import { RoleBasedAccessControlService } from '../services/RoleBasedAccessControlService';
import { PatientRepository } from '../repositories/PatientRepository';
import { MedicalRecordRepository } from '../repositories/MedicalRecordRepository';

const router = Router();

// Initialize dependencies
const patientRepository = new PatientRepository();
const medicalRecordRepository = new MedicalRecordRepository();
const rbacService = new RoleBasedAccessControlService();
const patientUpdateService = new PatientUpdateService(
  patientRepository,
  medicalRecordRepository,
  rbacService
);
const controller = new PatientUpdateController(patientUpdateService);

// UC03 Routes
router.post('/patients/:patientID/update-record', (req, res) =>
  controller.updatePatientRecord(req, res)
);

router.post('/medical-records/:recordID/consultation-notes', (req, res) =>
  controller.addConsultationNotes(req, res)
);

router.post('/medical-records/:recordID/diagnosis', (req, res) =>
  controller.diagnosisUpdate(req, res)
);

router.post('/medical-records/:recordID/vital-signs', (req, res) =>
  controller.updateVitalSigns(req, res)
);

export default router;