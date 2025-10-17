import { IRoleBasedAccessControl } from '../core/interfaces/IRoleBasedAccessControl';
import { UnauthorizedError } from '../core/errors/UnauthorizedError';

/**
 * RoleBasedAccessControlService - UC03 RBAC Implementation
 * SOLID Principles:
 * - Single Responsibility: Only handles RBAC logic
 * - Open/Closed: Easy to extend with new roles
 * - Liskov Substitution: Implements IRoleBasedAccessControl
 * - Interface Segregation: Uses minimal interface
 * - Dependency Inversion: Depends on abstraction
 */
export class RoleBasedAccessControlService implements IRoleBasedAccessControl {
    private rolePermissions: Map<string, Set<string>> = new Map([
    ['DOCTOR', new Set(['DIAGNOSE', 'PRESCRIBE', 'VIEW_RECORD', 'UPDATE_DIAGNOSIS', 'ADD_NOTES'])],
    ['NURSE', new Set(['UPDATE_VITALS', 'VIEW_RECORD', 'ASSIST_TREATMENT', 'MARK_ATTENDANCE'])],
    ['ADMIN', new Set(['SCHEDULE_APPOINTMENT', 'CANCEL_APPOINTMENT', 'PROCESS_BILLING', 'VIEW_RECORD'])]
  ]);
  private fieldAccessibility: Map<string, string[]> = new Map([
    ['DOCTOR', ['diagnosis', 'prescription', 'consultationNotes', 'name', 'dateOfBirth']],
    ['NURSE', ['consultationNotes', 'vitals', 'name', 'phone']],
    ['ADMIN', ['name', 'email', 'phone', 'address', 'appointment', 'billing']]
  ]);
  async canUpdateRecord(role: string, updateType: string): Promise<boolean> {
    const permissions = this.rolePermissions.get(role);
    if (!permissions) throw new UnauthorizedError(`Invalid role: ${role}`);
    return permissions.has(updateType);
  }
  getAccessibleFields(role: string): string[] {
    const fields = this.fieldAccessibility.get(role);
    if (!fields) throw new UnauthorizedError(`Invalid role: ${role}`);
    return fields;
  }
}