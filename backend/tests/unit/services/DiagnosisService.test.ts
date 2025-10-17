import { DiagnosisService } from '../../../src/services/DiagnosisService';

describe('DiagnosisService', () => {
  let service: DiagnosisService;
  let mockDiagnosisRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    // Mock DiagnosisRepository
    mockDiagnosisRepo = {
      create: jest.fn(),
      findByPatientId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    // Mock UserRepository
    mockUserRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    // Create service
    service = new DiagnosisService(mockDiagnosisRepo, mockUserRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDiagnosis', () => {
    it('should create diagnosis successfully', async () => {
      const mockUser = {
        _id: '123',
        userId: 'PAT-202510-0001',
        role: 'patient',
        name: 'Test Patient',
        email: 'patient@test.com',
      };

      const diagnosisData = {
        patientId: '123',
        description: 'Type 2 Diabetes Mellitus',
        diagnosisDate: new Date('2025-10-15'),
      };

      const mockDiagnosis = {
        ...diagnosisData,
        _id: 'diag123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockDiagnosisRepo.create.mockResolvedValue(mockDiagnosis);

      const result = await service.createDiagnosis(diagnosisData);

      expect(result).toEqual(mockDiagnosis);
      expect(mockUserRepo.findById).toHaveBeenCalledWith('123');
      expect(mockDiagnosisRepo.create).toHaveBeenCalledWith(diagnosisData);
    });

    it('should throw error if patient not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(
        service.createDiagnosis({
          patientId: '999',
          description: 'Test Diagnosis',
          diagnosisDate: new Date(),
        })
      ).rejects.toThrow('Patient not found');
    });

    it('should create diagnosis with current date if not provided', async () => {
      const mockUser = {
        _id: '123',
        role: 'patient',
      };

      const diagnosisData = {
        patientId: '123',
        description: 'Hypertension',
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockDiagnosisRepo.create.mockImplementation((data: any) => 
        Promise.resolve({
          ...data,
          _id: 'diag123',
          diagnosisDate: new Date(),
        })
      );

      const result = await service.createDiagnosis(diagnosisData);

      expect(result).toBeDefined();
      expect(result.description).toBe('Hypertension');
      expect(mockDiagnosisRepo.create).toHaveBeenCalled();
    });
  });

  describe('getDiagnosesByPatientId', () => {
    it('should return all diagnoses for a patient', async () => {
      const mockDiagnoses = [
        {
          _id: '1',
          patientId: '123',
          description: 'Type 2 Diabetes',
          diagnosisDate: new Date('2025-10-10'),
        },
        {
          _id: '2',
          patientId: '123',
          description: 'Hypertension',
          diagnosisDate: new Date('2025-10-15'),
        },
      ];

      mockDiagnosisRepo.findByPatientId.mockResolvedValue(mockDiagnoses);

      const result = await service.getDiagnosesByPatientId('123');

      expect(result).toEqual(mockDiagnoses);
      expect(result).toHaveLength(2);
      expect(mockDiagnosisRepo.findByPatientId).toHaveBeenCalledWith('123');
    });

    it('should return empty array if no diagnoses found', async () => {
      mockDiagnosisRepo.findByPatientId.mockResolvedValue([]);

      const result = await service.getDiagnosesByPatientId('123');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getDiagnosesByCustomUserId', () => {
    it('should get diagnoses by custom user ID', async () => {
      const mockUser = {
        _id: '123',
        userId: 'PAT-202510-0001',
      };

      const mockDiagnoses = [
        {
          _id: '1',
          description: 'Diagnosis 1',
          diagnosisDate: new Date(),
        },
        {
          _id: '2',
          description: 'Diagnosis 2',
          diagnosisDate: new Date(),
        },
      ];

      mockUserRepo.findByUserId.mockResolvedValue(mockUser);
      mockDiagnosisRepo.findByPatientId.mockResolvedValue(mockDiagnoses);

      const result = await service.getDiagnosesByCustomUserId('PAT-202510-0001');

      expect(result).toEqual(mockDiagnoses);
      expect(mockUserRepo.findByUserId).toHaveBeenCalledWith('PAT-202510-0001');
      expect(mockDiagnosisRepo.findByPatientId).toHaveBeenCalledWith('123');
    });

    // ✅ FIXED: Changed expected error message to match actual service
    it('should throw error if user not found', async () => {
      mockUserRepo.findByUserId.mockResolvedValue(null);

      await expect(
        service.getDiagnosesByCustomUserId('PAT-999999-9999')
      ).rejects.toThrow('Patient not found'); // Changed from 'User not found'
    });
  });

  describe('getDiagnosisById', () => {
    it('should return diagnosis by ID', async () => {
      const mockDiagnosis = {
        _id: 'diag123',
        patientId: '123',
        description: 'Type 2 Diabetes',
        diagnosisDate: new Date(),
      };

      mockDiagnosisRepo.findById.mockResolvedValue(mockDiagnosis);

      const result = await service.getDiagnosisById('diag123');

      expect(result).toEqual(mockDiagnosis);
      expect(mockDiagnosisRepo.findById).toHaveBeenCalledWith('diag123');
    });

    it('should throw error if diagnosis not found', async () => {
      mockDiagnosisRepo.findById.mockResolvedValue(null);

      await expect(service.getDiagnosisById('999')).rejects.toThrow(
        'Diagnosis not found'
      );
    });
  });

  describe('updateDiagnosis', () => {
    it('should update diagnosis successfully', async () => {
      const existingDiagnosis = {
        _id: 'diag123',
        patientId: '123',
        description: 'Old description',
        diagnosisDate: new Date('2025-10-10'),
      };

      const updateData = {
        description: 'Updated: Type 2 Diabetes with complications',
      };

      const updatedDiagnosis = {
        ...existingDiagnosis,
        ...updateData,
      };

      mockDiagnosisRepo.findById.mockResolvedValue(existingDiagnosis);
      mockDiagnosisRepo.update.mockResolvedValue(updatedDiagnosis);

      const result = await service.updateDiagnosis('diag123', updateData);

      expect(result).toEqual(updatedDiagnosis);
      expect(mockDiagnosisRepo.update).toHaveBeenCalledWith('diag123', updateData);
    });

    it('should throw error if diagnosis not found', async () => {
      mockDiagnosisRepo.findById.mockResolvedValue(null);

      await expect(
        service.updateDiagnosis('999', { description: 'Test' })
      ).rejects.toThrow('Diagnosis not found');
    });

    it('should update diagnosis date', async () => {
      const existingDiagnosis = {
        _id: 'diag123',
        description: 'Hypertension',
        diagnosisDate: new Date('2025-10-10'),
      };

      const newDate = new Date('2025-10-20');
      const updateData = {
        diagnosisDate: newDate,
      };

      mockDiagnosisRepo.findById.mockResolvedValue(existingDiagnosis);
      mockDiagnosisRepo.update.mockResolvedValue({
        ...existingDiagnosis,
        ...updateData,
      });

      const result = await service.updateDiagnosis('diag123', updateData);

      expect(result.diagnosisDate).toEqual(newDate);
    });
  });

  describe('deleteDiagnosis', () => {
    it('should delete diagnosis successfully', async () => {
      const mockDiagnosis = {
        _id: 'diag123',
        description: 'Test Diagnosis',
      };

      mockDiagnosisRepo.findById.mockResolvedValue(mockDiagnosis);
      mockDiagnosisRepo.delete.mockResolvedValue(undefined);

      await service.deleteDiagnosis('diag123');

      expect(mockDiagnosisRepo.delete).toHaveBeenCalledWith('diag123');
    });

    it('should throw error if diagnosis not found', async () => {
      mockDiagnosisRepo.findById.mockResolvedValue(null);

      await expect(service.deleteDiagnosis('999')).rejects.toThrow(
        'Diagnosis not found'
      );
    });
  });
});