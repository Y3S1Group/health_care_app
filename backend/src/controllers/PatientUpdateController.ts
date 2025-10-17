import { Request, Response } from 'express';
import { PatientUpdateService } from '../services/PatientUpdateService';
import { ValidationError } from '../core/errors/ValidationError';

/**
 * Patient Update Controller - UC03 Endpoints
 * SOLID: Single Responsibility - HTTP handling only
 */
export class PatientUpdateController {
  constructor(private patientUpdateService: PatientUpdateService) {}

  /**
   * UC03 Main Flow: Update Patient Record
   * POST /api/patients/:patientID/update-record
   */
  async updatePatientRecord(req: Request, res: Response): Promise<void> {
    try {
      const { patientID } = req.params;
      const { staffID, staffRole, updateData } = req.body;

      if (!staffID || !staffRole || !updateData) {
        throw new ValidationError('StaffID, StaffRole, and UpdateData required');
      }

      const updatedPatient = await this.patientUpdateService.updatePatientRecord(
        patientID,
        staffID,
        staffRole,
        updateData
      );

      res.status(200).json({
        success: true,
        message: 'Patient record updated successfully',
        data: updatedPatient
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * UC03 Doctor: Add Consultation Notes
   * POST /api/medical-records/:recordID/consultation-notes
   */
  async addConsultationNotes(req: Request, res: Response): Promise<void> {
    try {
      const { recordID } = req.params;
      const { staffID, staffRole, notes } = req.body;

      if (!staffID || !staffRole || !notes) {
        throw new ValidationError('StaffID, StaffRole, and Notes required');
      }

      const result = await this.patientUpdateService.addConsultationNotes(
        recordID,
        staffID,
        staffRole,
        notes
      );

      res.status(200).json({
        success: true,
        message: 'Consultation notes added successfully',
        data: result
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * UC03 Doctor: Add Diagnosis
   * POST /api/medical-records/:recordID/diagnosis
   */
  async diagnosisUpdate(req: Request, res: Response): Promise<void> {
    try {
      const { recordID } = req.params;
      const { staffID, staffRole, diagnosis } = req.body;

      if (!staffID || !staffRole || !diagnosis) {
        throw new ValidationError('StaffID, StaffRole, and Diagnosis required');
      }

      const result = await this.patientUpdateService.diagnosisUpdate(
        recordID,
        staffID,
        staffRole,
        diagnosis,
        true
      );

      res.status(200).json({
        success: true,
        message: 'Diagnosis added successfully',
        data: result
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * UC03 Nurse: Update Vital Signs
   * Alternate Flow A2: Detect abnormalities
   * POST /api/medical-records/:recordID/vital-signs
   */
  async updateVitalSigns(req: Request, res: Response): Promise<void> {
    try {
      const { recordID } = req.params;
      const { staffID, staffRole, vitals } = req.body;

      if (!staffID || !staffRole || !vitals) {
        throw new ValidationError('StaffID, StaffRole, and Vitals required');
      }

      const result = await this.patientUpdateService.updateVitals(
        recordID,
        staffID,
        staffRole,
        vitals
      );

      res.status(200).json({
        success: true,
        message: 'Vital signs updated successfully',
        data: result,
        alertDoctor: result.hasAbnormalities
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}