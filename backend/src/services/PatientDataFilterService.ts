import { IPatientDataFilter, FilteredPatientData } from '../core/interfaces/IPatientDataFilter';
import { IPatientProfile } from '../core/interfaces/IPatientProfileRepository';

export class PatientDataFilterService implements IPatientDataFilter {
  private readonly roleFieldAccess: Record<string, string[]> = {
    admin: ['*'],
    
    doctor: [
      'userId',
      'temperature',
      'bloodPressure',
      'heartRate',
      'totalCharges',
      'paidAmount',
      'outstanding',
      'insuranceProvider',
      'policyNumber',
      'groupNumber',
      'dischargeDate',
      'attendingPhysician',
      'dischargeSummary',
      'createdAt',
      'updatedAt',
    ],
    
    nurse: [
      'userId',
      'temperature',
      'bloodPressure',
      'heartRate',
      'dischargeDate',
      'attendingPhysician',
      'createdAt',
      'updatedAt',
    ],
    
    staff: [
      'userId',
      'totalCharges',
      'paidAmount',
      'outstanding',
      'insuranceProvider',
      'policyNumber',
      'groupNumber',
      'createdAt',
      'updatedAt',
    ],
    
    manager: [
      'userId',
      'totalCharges',
      'paidAmount',
      'outstanding',
      'insuranceProvider',
      'dischargeDate',
      'createdAt',
      'updatedAt',
    ],
  };

  filterByRole(profile: IPatientProfile, staffRole: string): FilteredPatientData {
    const accessibleFields = this.getAccessibleFields(staffRole);
    const allFields = Object.keys(profile);
    
    if (accessibleFields.includes('*')) {
      return {
        profile,
        allowedFields: allFields,
        deniedFields: [],
      };
    }

    const filteredProfile: Partial<IPatientProfile> = {};
    const deniedFields: string[] = [];

  for (const field of allFields) {
    if (accessibleFields.includes(field)) {
      const key = field as keyof IPatientProfile;
      (filteredProfile as any)[key] = profile[key];
    } else {
      deniedFields.push(field);
    }
  }

    return {
      profile: filteredProfile,
      allowedFields: accessibleFields,
      deniedFields,
    };
  }

  getAccessibleFields(staffRole: string): string[] {
    const normalizedRole = staffRole.toLowerCase();
    return this.roleFieldAccess[normalizedRole] || [];
  }

  canAccessField(staffRole: string, fieldName: string): boolean {
    const accessibleFields = this.getAccessibleFields(staffRole);
    return accessibleFields.includes('*') || accessibleFields.includes(fieldName);
  }

  getRoleAccessDescription(staffRole: string): string {
    const normalizedRole = staffRole.toLowerCase();
    
    const descriptions: Record<string, string> = {
      admin: 'Full access to all patient information',
      doctor: 'Access to medical data, vitals, billing, insurance, and discharge information',
      nurse: 'Access to vitals, basic medical data, and discharge information',
      staff: 'Access to billing and insurance information only',
      manager: 'Access to billing, insurance, and discharge information',
    };

    return descriptions[normalizedRole] || 'No access permissions defined';
  }
}