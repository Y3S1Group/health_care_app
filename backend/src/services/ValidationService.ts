import { ValidationError } from '../core/errors/ValidationError';
import { IHospitalStaffRepository } from '../core/interfaces/IHospitalStaffRepository';

export class ValidationService {
    constructor(private staffRepo: IHospitalStaffRepository) { }

    validateAllocationData(department: string, bedCount: number): void {
        if (!department || department.trim() === '') {
            throw new ValidationError('Department is required');
        }

        if (bedCount < 0) {
            throw new ValidationError('Bed count cannot be negative');
        }

        if (!Number.isInteger(bedCount)) {
            throw new ValidationError('Bed count must be an integer');
        }
    }

    async validateStaffIds(staffIds: string[], department: string): Promise<void> {
        if (!Array.isArray(staffIds) || staffIds.length === 0) {
            throw new ValidationError('At least one staff member is required');
        }

        const staffMembers = await this.staffRepo.findByIds(staffIds);

        if (staffMembers.length !== staffIds.length) {
            throw new ValidationError('One or more staff IDs are invalid');
        }

        const invalidStaff = staffMembers.filter(s => s.department !== department);
        if (invalidStaff.length > 0) {
            throw new ValidationError('All staff must belong to the same department');
        }
    }

    validateReallocationData(staffIds?: string[], bedCount?: number): void {
        if (staffIds !== undefined && (!Array.isArray(staffIds) || staffIds.length === 0)) {
            throw new ValidationError('Staff IDs must be a non-empty array');
        }

        if (bedCount !== undefined) {
            if (bedCount < 0) {
                throw new ValidationError('Bed count cannot be negative');
            }
            if (!Number.isInteger(bedCount)) {
                throw new ValidationError('Bed count must be an integer');
            }
        }
    }
}