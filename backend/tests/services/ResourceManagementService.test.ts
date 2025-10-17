// tests/services/ResourceManagementService.test.ts
import { ResourceManagementService } from '../../src/services/ResourceManagementService';
import { NotFoundError } from '../../src/core/errors/NotFoundError';
import { ValidationError } from '../../src/core/errors/ValidationError';
import { ValidationService } from '../../src/services/ValidationService';
import { NotificationService } from '../../src/services/NotificationService';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'MOCK-UUID-12345')
}));

describe('ResourceManagementService', () => {
  const managerID = 'MGR-202510-0001';

  let service: ResourceManagementService;
  let allocationRepo: any;
  let userRepo: any;
  let hospitalRepo: any;
  let staffRepo: any;
  let resourceRepo: any;
  let auditService: any;
  let validationService: ValidationService;
  let notificationService: NotificationService;

  beforeEach(() => {
    allocationRepo = {
      findAll: jest.fn(),
      create: jest.fn(),
      findByAllocationID: jest.fn(),
      update: jest.fn()
    };
    userRepo = { findByUserId: jest.fn() };
    hospitalRepo = { findByHospitalID: jest.fn() };
    staffRepo = { 
      findByIds: jest.fn(), 
      findAvailableStaff: jest.fn() 
    };
    resourceRepo = { findAll: jest.fn(), createOrUpdate: jest.fn() };
    auditService = { log: jest.fn() };
    
    validationService = new ValidationService(staffRepo);
    notificationService = new NotificationService();
    jest.spyOn(notificationService, 'notifyDepartment').mockResolvedValue(undefined);
    jest.spyOn(notificationService, 'notifyStaff').mockResolvedValue(undefined);

    service = new ResourceManagementService(
      allocationRepo,
      userRepo,
      hospitalRepo,
      staffRepo,
      resourceRepo,
      auditService,
      validationService,
      notificationService
    );
  });

  // ---------------------------
  // validateManager
  // ---------------------------
  describe('validateManager', () => {
    it('throws NotFoundError if manager does not exist', async () => {
      userRepo.findByUserId.mockResolvedValue(null);
      await expect(service['validateManager'](managerID)).rejects.toThrow(NotFoundError);
    });

    it('throws NotFoundError if user role is not manager', async () => {
      userRepo.findByUserId.mockResolvedValue({ role: 'staff' });
      await expect(service['validateManager'](managerID)).rejects.toThrow(NotFoundError);
    });

    it('returns manager if valid', async () => {
      const mockManager = { role: 'manager', userID: managerID };
      userRepo.findByUserId.mockResolvedValue(mockManager);
      const result = await service['validateManager'](managerID);
      expect(result).toEqual(mockManager);
    });
  });

  // ---------------------------
  // getPatientFlowAnalysis
  // ---------------------------
  describe('getPatientFlowAnalysis', () => {
    it('returns correct flow analysis', async () => {
      userRepo.findByUserId.mockResolvedValue({ role: 'manager', userID: managerID });
      allocationRepo.findAll.mockResolvedValue([
        { department: 'Cardiology', staffIds: ['s1'], bedCount: 10 },
        { department: 'Cardiology', staffIds: ['s2'], bedCount: 5 },
        { department: 'Neurology', staffIds: ['s3'], bedCount: 20 },
      ]);

      const result = await service.getPatientFlowAnalysis(managerID);

      expect(result.managerID).toBe(managerID);
      expect(result.flowAnalysis).toHaveLength(2);
      expect(result.flowAnalysis.find((d: any) => d.department === 'Cardiology')?.currentStaff).toBe(2);
      expect(result.flowAnalysis.find((d: any) => d.department === 'Cardiology')?.currentBeds).toBe(15);
      expect(result.flowAnalysis.find((d: any) => d.department === 'Cardiology')?.flowStatus).toBe('NORMAL');
    });

    it('throws error for invalid manager', async () => {
      userRepo.findByUserId.mockResolvedValue(null);
      await expect(service.getPatientFlowAnalysis('INVALID')).rejects.toThrow(NotFoundError);
    });
  });

  // ---------------------------
  // getDepartmentUtilization
  // ---------------------------
  describe('getDepartmentUtilization', () => {
    it('calculates utilization correctly', async () => {
      userRepo.findByUserId.mockResolvedValue({ role: 'manager', userID: managerID });
      resourceRepo.findAll.mockResolvedValue([
        { department: 'Cardiology', bedCount: 20 },
        { department: 'Neurology', bedCount: 10 },
      ]);
      allocationRepo.findAll.mockResolvedValue([
        { department: 'Cardiology', bedCount: 15, staffIds: ['s1'] },
        { department: 'Neurology', bedCount: 5, staffIds: ['s2'] },
      ]);

      const result = await service.getDepartmentUtilization(managerID);
      expect(result.utilization.find((d: any) => d.department === 'Cardiology')?.utilizationRate).toBeCloseTo(75);
      expect(result.utilization.find((d: any) => d.department === 'Neurology')?.status).toBe('NORMAL');
    });

    it('returns zero utilization if no beds', async () => {
      userRepo.findByUserId.mockResolvedValue({ role: 'manager', userID: managerID });
      resourceRepo.findAll.mockResolvedValue([{ department: 'Empty', bedCount: 0 }]);
      allocationRepo.findAll.mockResolvedValue([]);
      const result = await service.getDepartmentUtilization(managerID);
      expect(result.utilization[0].utilizationRate).toBe(0);
    });
  });

  // ---------------------------
  // detectShortages
  // ---------------------------
  describe('detectShortages', () => {
    it('detects critical shortages when utilization > 95', async () => {
      jest.spyOn(service, 'getDepartmentUtilization').mockResolvedValue({
        utilization: [{ department: 'Cardiology', utilizationRate: 96, totalBeds: 100 }]
      });

      const result = await service.detectShortages(managerID);
      expect(result.hasShortages).toBe(true);
      expect(result.shortages[0].severity).toBe('CRITICAL');
      expect(auditService.log).toHaveBeenCalled();
    });

    it('detects high shortages when utilization <= 95', async () => {
      jest.spyOn(service, 'getDepartmentUtilization').mockResolvedValue({
        utilization: [{ department: 'Cardiology', utilizationRate: 94, totalBeds: 100 }]
      });

      const result = await service.detectShortages(managerID);
      expect(result.hasShortages).toBe(true);
      expect(result.shortages[0].severity).toBe('HIGH');
    });

    it('returns no shortages if utilization normal', async () => {
      jest.spyOn(service, 'getDepartmentUtilization').mockResolvedValue({
        utilization: [{ department: 'Cardiology', utilizationRate: 50, totalBeds: 100 }]
      });
      const result = await service.detectShortages(managerID);
      expect(result.hasShortages).toBe(false);
      expect(result.shortages).toHaveLength(0);
    });
  });

  // ---------------------------
  // suggestReallocation
  // ---------------------------
  describe('suggestReallocation', () => {
    it('returns suggestions if shortages exist', async () => {
      jest.spyOn(service, 'detectShortages').mockResolvedValue({
        hasShortages: true,
        shortages: [{ department: 'Cardiology', required: 5, severity: 'HIGH', message: 'msg' }]
      });
      jest.spyOn(service, 'getDepartmentUtilization').mockResolvedValue({
        utilization: [{ department: 'Neurology', utilizationRate: 30, availableBeds: 10 }]
      });

      const result = await service.suggestReallocation(managerID);
      expect(result.suggestions).toHaveLength(1);
      expect(result.suggestions[0].from).toBe('Neurology');
    });

    it('returns empty suggestions if no shortages', async () => {
      jest.spyOn(service, 'detectShortages').mockResolvedValue({ hasShortages: false, shortages: [] });
      const result = await service.suggestReallocation(managerID);
      expect(result.suggestions).toHaveLength(0);
    });
  });

  // ---------------------------
  // allocateResources
  // ---------------------------
  describe('allocateResources', () => {
    it('allocates resources successfully', async () => {
      userRepo.findByUserId.mockResolvedValue({ role: 'manager', userID: managerID });
      hospitalRepo.findByHospitalID.mockResolvedValue({ hospitalID: 'H1' });
      staffRepo.findByIds.mockResolvedValue([{ staffID: 'S1', department: 'Cardiology' }]);
      resourceRepo.createOrUpdate.mockResolvedValue({});
      allocationRepo.create.mockResolvedValue({ allocationID: 'ALLOC1' });

      const allocation = await service.allocateResources(
        managerID,
        'H1',
        'Cardiology',
        ['S1'],
        5,
        ['ECG']
      );

      expect(allocation.allocationID).toBe('ALLOC1');
      expect(auditService.log).toHaveBeenCalled();
      expect(notificationService.notifyDepartment).toHaveBeenCalled();
      expect(notificationService.notifyStaff).toHaveBeenCalled();
    });

    it('throws ValidationError if staff invalid', async () => {
      userRepo.findByUserId.mockResolvedValue({ role: 'manager', userID: managerID });
      hospitalRepo.findByHospitalID.mockResolvedValue({ hospitalID: 'H1' });
      staffRepo.findByIds.mockResolvedValue([]); // invalid staff
      await expect(
        service.allocateResources(managerID, 'H1', 'Cardiology', ['S1'], 5, [])
      ).rejects.toThrow(ValidationError);
    });

    it('throws NotFoundError if hospital invalid', async () => {
      userRepo.findByUserId.mockResolvedValue({ role: 'manager', userID: managerID });
      hospitalRepo.findByHospitalID.mockResolvedValue(null);
      await expect(
        service.allocateResources(managerID, 'H1', 'Cardiology', ['S1'], 5, [])
      ).rejects.toThrow(NotFoundError);
    });
  });

  // ---------------------------
  // reallocateResources
  // ---------------------------
  describe('reallocateResources', () => {
    it('reallocates successfully', async () => {
      userRepo.findByUserId.mockResolvedValue({ role: 'manager', userID: managerID });
      allocationRepo.findByAllocationID.mockResolvedValue({ allocationID: 'A1', department: 'Cardiology' });
      allocationRepo.update.mockResolvedValue({ allocationID: 'A1', staffIds: ['S2'] });

      const updated = await service.reallocateResources(managerID, 'A1', ['S2'], 10, ['ECG']);
      expect(updated.staffIds).toContain('S2');
      expect(auditService.log).toHaveBeenCalled();
      expect(notificationService.notifyDepartment).toHaveBeenCalled();
    });

    it('throws NotFoundError if allocation invalid', async () => {
      userRepo.findByUserId.mockResolvedValue({ role: 'manager', userID: managerID });
      allocationRepo.findByAllocationID.mockResolvedValue(null);
      await expect(service.reallocateResources(managerID, 'INVALID')).rejects.toThrow(NotFoundError);
    });
  });

  // ---------------------------
  // getAllocationById
  // ---------------------------
  describe('getAllocationById', () => {
    it('returns allocation if exists', async () => {
      allocationRepo.findByAllocationID.mockResolvedValue({ allocationID: 'A1' });
      const result = await service.getAllocationById('A1');
      expect(result.allocationID).toBe('A1');
    });

    it('throws NotFoundError if allocation not found', async () => {
      allocationRepo.findByAllocationID.mockResolvedValue(null);
      await expect(service.getAllocationById('X')).rejects.toThrow(NotFoundError);
    });
  });

  // ---------------------------
  // getAllAllocations
  // ---------------------------
  describe('getAllAllocations', () => {
    it('returns all allocations', async () => {
      allocationRepo.findAll.mockResolvedValue([{ allocationID: 'A1' }, { allocationID: 'A2' }]);
      const result = await service.getAllAllocations();
      expect(result).toHaveLength(2);
    });
  });
});
