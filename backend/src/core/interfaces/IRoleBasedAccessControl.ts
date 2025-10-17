/**
 * RBAC Interface - UC03 Access Control
 * Defines role-based permissions for patient record updates
 */
export interface IRoleBasedAccessControl {
  canUpdateRecord(role: string, updateType: string): Promise<boolean>;
  getAccessibleFields(role: string): string[];
}