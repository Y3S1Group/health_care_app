import { NotFoundError } from "../core/errors/NotFoundError";
import { IAuditService } from "../core/interfaces/IAuditService";
import { IHealthcareManagerRepository } from "../core/interfaces/IHealthcareManagerRepository";
import { IHospitalRepository } from "../core/interfaces/IHospitalRepository";
import { IHospitalStaffRepository } from "../core/interfaces/IHospitalStaffRepository";
import { IResourceAllocationRepository } from "../core/interfaces/IResourceAllocationRepository";
import { IResourceRepository } from "../core/interfaces/IResourceRepository";
import { NotificationService } from "./NotificationService";
import { ValidationService } from "./ValidationService";
import { IResourceAllocation } from "../models/ResourceAllocation";
import { v4 as uuidv4 } from 'uuid';
import { ValidationError } from "../core/errors/ValidationError";

export class ResourceManagementService {
    constructor(
        private allocationRepo: IResourceAllocationRepository,
        private managerRepo: IHealthcareManagerRepository,
        private hospitalRepo: IHospitalRepository,
        private staffRepo: IHospitalStaffRepository,
        private resourceRepo: IResourceRepository,
        private auditService: IAuditService,
        private validationService: ValidationService,
        private notificationService: NotificationService
    ) {}

    //Get patient flow analysis
    async getPatientFlowAnalysis(managerID: string):Promise<any> {
        const manager = await this.managerRepo.findByManagerID(managerID);
        if (!manager) throw new NotFoundError('HealthcareManager');

        //using collectData() method in HealthcareManager class
        const collectData = await manager.collectData();

        const allocations = await this.allocationRepo.findAll();
        const departments = [...new Set(allocations.map(a => a.department))];

        const flowAnalysis = departments.map(dept => {
            const deptAllocatons = allocations.filter(a => a.department === dept);
            const totalStaff = deptAllocatons.reduce((sum, a) => sum + a.staffIds.length, 0);
            const totalBeds = deptAllocatons.reduce((sum, a) => sum + a.bedCount, 0);

            return {
                department: dept,
                currentStaff: totalStaff,
                currentBeds: totalBeds,
                flowStatus: totalBeds > 50 ? 'HIGH' : 'NORMAL'
            };
        });

        return {
            managerID,
            collectedAt: collectData.timestamp,
            flowAnalysis
        };
    }

    //Get department utilization
    async getDepartmentUtilization(managerID: string): Promise<any> {
        const manager = await this.managerRepo.findByManagerID(managerID);
        if (!manager) throw new NotFoundError('HealthcareManager');

        //using analyzeTrend() method in HealthcareManager class
        const trends = await manager.analyzeTrends();

        const resources = await this.resourceRepo.findAll();
        const allocations = await this.allocationRepo.findAll();

        const utilization = resources.map(resource => {
            const deptAllocatons = allocations.filter(a => a.department === resource.department);
            const allocatedBeds = deptAllocatons.reduce((sum, a) => sum + a.bedCount, 0);
            const utilizationRate = resource.bedCount > 0
                ? (allocatedBeds / resource.bedCount) * 100
                : 0;

            return {
                department: resource.department,
                totalBeds: resource.bedCount,
                allocatedBeds,
                availableBeds: resource.bedCount - allocatedBeds,
                utilizationRate: parseFloat(utilizationRate.toFixed(2)),
                status: utilizationRate > 90 ? 'CRITICAL' : utilizationRate > 70 ? "HIGH" : "NORMAL"
            };
        });

        return {
             managerID,
             trends: trends.trends,
             utilization
        };
    }

    //Detect Shortages
    async detectShortages(managerID: string): Promise<any> {
        const utilizationData = await this.getDepartmentUtilization(managerID);
        const { utilization } = utilizationData;

        const shortages = utilization
            .filter((dept: any) => dept.utilizationRate > 90)
            .map((dept: any) => ({
                department: dept.department,
                shortageType: 'BEDS',
                severity: dept.utilizationRate > 95 ? 'CRITICAL' : 'HIGH',
                required: Math.ceil(dept.totalBeds * 0.2),
                currentUtilization: dept.utilizationRate,
                message: `${dept.department} requires ${Math.ceil(dept.totalBeds * 0.2)} additional beds`
            }));
        
        if (shortages.length > 0) {
            await this.auditService.log(
                managerID,
                'SHORTAGE_DETECTED',
                'RESOURCE_ALLOCATION',
                { shortages }
            );
        }

        return {
            hasShortages: shortages.length > 0,
            shortageCount: shortages.length,
            shortages,
            alert: shortages.length > 0
                ? 'Resource shortage detected - immediate action required'
                : 'No shortages detected'
        };
    }

    //Suggest reallocation
    async suggestReallocation(managerID: string): Promise<any> {
        const shortageData = await this.detectShortages(managerID);

        if (!shortageData.hasShortages) {
            return {
                suggestions: [],
                message: 'No reallocation needed - all departments operating normally'
            };
        }

        const utilizationData = await this.getDepartmentUtilization(managerID);
        const { utilization } = utilizationData;

        const underutilized = utilization.filter(
            (dept: any) => dept.utilizationRate < 50 && dept.availableBeds > 0
        );

        const suggestions = shortageData.shortages.map((shortage: any) => {
            const source = underutilized.find((d: { availableBeds: number; }) => d.availableBeds >= shortage.required) || underutilized[0];

            return {
                suggestionID: `SUGGEST-${Date.now()}-${shortage.department}`,
                from: source?.department || 'EXTERNAL_PROCUREMENT',
                to: shortage.department,
                resourceType: shortage.shortageType,
                quantity: shortage.required,
                priority: shortage.severity,
                reason: shortage.message
            };
        });

        return { suggestions, totalSuggestions: suggestions.length };
    }

    async allocateResources(
        managerID: string,
        hospitalID: string,
        department: string,
        staffIds: string[],
        bedCount: number,
        equipment: string[]
    ): Promise<IResourceAllocation> {
        
        const manager = await this.managerRepo.findByManagerID(managerID);
        if (!manager) throw new NotFoundError('HealthcareManager');

        const hospital = await this.hospitalRepo.findByHospitalID(hospitalID);
        if (!hospital) throw new NotFoundError('Hospital');

        this.validationService.validateAllocationData(department, bedCount);

        const staff = await this.staffRepo.findByIds(staffIds);
        if (staff.length !== staffIds.length) {
            throw new ValidationError('One or more staff IDs are invalid');
        }

        const invalidStaff = staff.filter(s => s.department !== department);
        let finalStaffIds = staffIds;
        let backupUsed = false;

        if (invalidStaff.length > 0) {
            const backupStaff = await this.staffRepo.findAvailableStaff(department, invalidStaff.length);
            finalStaffIds = [
                ...staff.filter(s => s.department === department).map(s => s.staffID),
                ...backupStaff.map(s => s.staffID)
            ];
            backupUsed = true;
        }

        await this.resourceRepo.createOrUpdate(department, {
            bedCount,
            equipment
        } as any);

        const allocation = await this.allocationRepo.create({
            allocationID: uuidv4().toUpperCase(),
            managerID,
            hospitalID,
            department,
            staffIds: finalStaffIds,
            bedCount,
            equipment,
            status: 'ACTIVE'
        } as IResourceAllocation);

        // Use HealthcareManager's allocateStaff() method
        await manager.allocateStaff(finalStaffIds, department);

        await this.auditService.log(
            managerID,
            'RESOURCE_ALLOCATED',
            allocation.allocationID,
            {
                department,
                staffCount: finalStaffIds.length,
                bedCount,
                equipmentCount: equipment.length,
                backupStaffUsed: backupUsed
            }
        );

        await this.notificationService.notifyDepartment(
            department,
            `Resource allocation completed: ${finalStaffIds.length} staff, ${bedCount} beds assigned`
        );

        await this.notificationService.notifyStaff(
            finalStaffIds,
            `You have been assigned to ${department} - check your updated schedule`
        );

        return allocation;
    }

    async reallocateResources(
        managerID: string,
        allocationID: string,
        staffIds?: string[],
        bedCount?: number,
        equipment?: string[]
    ): Promise<IResourceAllocation> {
        const manager = await this.managerRepo.findByManagerID(managerID);
        if (!manager) throw new NotFoundError('HealthcareManager');

        const allocation = await this.allocationRepo.findByAllocationID(allocationID);
        if (!allocation) throw new NotFoundError('ResourceAllocation');

        this.validationService.validateReallocationData(staffIds, bedCount);

        const updateData: any = {};
        if (staffIds) updateData.staffIds = staffIds;
        if (bedCount !== undefined) updateData.bedCount = bedCount;
        if (equipment) updateData.equipment = equipment;

        const updated = await this.allocationRepo.update(allocationID, updateData);

        await this.auditService.log(managerID, 'RESOURCE_REALLOCATED', allocationID, updateData);

        await this.notificationService.notifyDepartment(
            allocation.department,
            `Resource allocation updated`
        );

        if (staffIds) {
            await this.notificationService.notifyStaff(staffIds, `Your assignment has been updated`);
        }

        return updated;
    }

    async getAllAllocations(): Promise<IResourceAllocation[]> {
        return await this.allocationRepo.findAll();
    }

    async getAllocationById(allocationID: string): Promise<IResourceAllocation> {
        const allocation = await this.allocationRepo.findByAllocationID(allocationID);
        if (!allocation) throw new NotFoundError('ResourceAllocation');
        return allocation;
    }
}