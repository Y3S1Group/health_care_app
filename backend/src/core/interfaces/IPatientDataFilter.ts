import { IPatientProfile } from './IPatientProfileRepository';

export interface FilteredPatientData {
  profile: Partial<IPatientProfile>;
  allowedFields: string[];
  deniedFields: string[];
}

export interface IPatientDataFilter {
  filterByRole(profile: IPatientProfile, staffRole: string): FilteredPatientData;
  getAccessibleFields(staffRole: string): string[];
  canAccessField(staffRole: string, fieldName: string): boolean;
}