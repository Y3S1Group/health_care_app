import { IPatientRepository } from '../core/interfaces/IPatientRepository';
import { IMedicalRecordRepository } from '../core/interfaces/IMedicalRecordRepository';
import { IRoleBasedAccessControl } from '../core/interfaces/IRoleBasedAccessControl';
import { IHospitalStaff } from '../models/HospitalStaff';
import { IPatient } from '../models/Patient';
import { ValidationError } from '../core/errors/ValidationError';
import { NotFoundError } from '../core/errors/NotFoundError';
import { AuditLog } from '../models/AuditLog';

/**
 * Patient Update Service - UC03 Business Logic
 * SOLID: Single Responsibility - Patient update operations
 * Main Flow: Verify role → Check permissions → Update → Audit log
 */
export class PatientUpdateService {
  constructor(
    private patientRepository: IPatientRepository,
    private medicalRecordRepository: IMedicalRecordRepository,
    private rbacService: IRoleBasedAccessControl
  ) {}

  /**
   * UC03 Main Flow Step 1-8: Update Patient Record with RBAC
   * Sequence: Staff logs in → Access Control Check → Filter Fields → Update → Log
   */
  async updatePatientRecord(
    patientID: string,
    staffID: string,
    staffRole: string,
    updateData: any
  ): Promise<IPatient> {
    // Step 1-2: Staff authentication (already done in controller)
    // Step 3: Access Control Manager checks permissions
    const hasPermission = await this.rbacService.canUpdateRecord(staffRole, 'UPDATE_RECORD');
    if (!hasPermission) {
      throw new ValidationError(`Role ${staffRole} cannot update patient record`);
    }

    // Step 3: Get patient
    const patient = await this.patientRepository.findByPatientID(patientID);
    if (!patient) {
      throw new NotFoundError(`Patient ${patientID}`);
    }

    // Step 4: Filter fields based on role
    const accessibleFields = this.rbacService.getAccessibleFields(staffRole);
    const filteredData = this.filterData(updateData, accessibleFields);

    // Step 5-8: Update and audit log
    const updatedPatient = await this.patientRepository.update(patientID, filteredData);

    // Audit Log
    await this.logAudit(staffID, 'UPDATE_PATIENT_RECORD', patientID, staffRole, filteredData);

    return updatedPatient;
  }

  /**
   * UC03 Doctor: Add Consultation Notes
   * Calls: Doctor.addConsultationNotes() → MedicalRecord.addConsultationNote()
   */
  async addConsultationNotes(
    recordID: string,
    staffID: string,
    staffRole: string,
    notes: string
  ): Promise<any> {
    if (staffRole !== 'DOCTOR') {
      throw new ValidationError('Only doctors can add consultation notes');
    }

    const record = await this.medicalRecordRepository.findByRecordID(recordID);
    if (!record) {
      throw new NotFoundError(`Medical Record ${recordID}`);
    }

    await record.addConsultationNote(notes);
    await this.logAudit(staffID, 'ADD_CONSULTATION_NOTES', recordID, staffRole, { notes });

    return record;
  }

  /**
   * UC03 Doctor: Diagnose Patient
   */
  async diagnosisUpdate(
    recordID: string,
    staffID: string,
    staffRole: string,
    diagnosis: string,
    notifyLab: boolean = false
  ): Promise<any> {
    if (staffRole !== 'DOCTOR') {
      throw new ValidationError('Only doctors can diagnose');
    }

    const record = await this.medicalRecordRepository.findByRecordID(recordID);
    if (!record) {
      throw new NotFoundError(`Medical Record ${recordID}`);
    }

    await record.updateRecord({ diagnosis });
    await this.logAudit(staffID, 'DIAGNOSE_PATIENT', recordID, staffRole, {
      diagnosis,
      notifyLabService: notifyLab
    });

    return record;
  }

  /**
   * UC03 Nurse: Update Vital Signs
   * Alternate Flow A2: Check abnormalities and alert doctor
   */
  async updateVitals(
    recordID: string,
    staffID: string,
    staffRole: string,
    vitals: any
  ): Promise<any> {
    if (staffRole !== 'NURSE') {
      throw new ValidationError('Only nurses can update vital signs');
    }

    const record = await this.medicalRecordRepository.findByRecordID(recordID);
    if (!record) {
      throw new NotFoundError(`Medical Record ${recordID}`);
    }

    const hasAbnormalities = this.checkAbnormalities(vitals);

    await record.updateRecord({ consultationNotes: JSON.stringify(vitals) });
    await this.logAudit(staffID, 'UPDATE_VITAL_SIGNS', recordID, staffRole, {
      vitals,
      hasAbnormalities,
      alertDoctor: hasAbnormalities
    });

    return { record, hasAbnormalities, alertDoctor: hasAbnormalities };
  }

  /**
   * Helper: Check vital abnormalities
   */
  private checkAbnormalities(vitals: any): boolean {
    return vitals.temperature < 36.5 || vitals.temperature > 37.5 ||
      vitals.heartRate < 60 || vitals.heartRate > 100;
  }

  /**
   * Helper: Filter data by role
   */
  private filterData(data: any, allowedFields: string[]): any {
    const filtered: any = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) filtered[field] = data[field];
    });
    return filtered;
  }

  /**
   * Helper: Audit Log
   */
  private async logAudit(
    actorId: string,
    action: string,
    target: string,
    role: string,
    details: any
  ): Promise<void> {
    try {
      await AuditLog.create({
        actorId,
        action,
        target,
        details: { ...details, role }
      });
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  }
}