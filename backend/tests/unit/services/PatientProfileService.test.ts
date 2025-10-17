import { PatientProfileService } from '../../../src/services/PatientProfileService';

describe('PatientProfileService', () => {
  let service: PatientProfileService;
  let mockPatientProfileRepo: any;
  let mockUserRepo: any;
  let mockResourceRepo: any;
  let mockAccessService: any;

  beforeEach(() => {
    // Mock PatientProfileRepository with jest.fn()
    mockPatientProfileRepo = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    // Mock UserRepository with jest.fn()
    mockUserRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    // Mock ResourceRepository
    mockResourceRepo = {
      findAll: jest.fn(),
      update: jest.fn(),
    };

    // Mock AccessService
    mockAccessService = {
      checkAccess: jest.fn(),
      grantAccess: jest.fn(),
    };

    // Create service with all required dependencies
    service = new PatientProfileService(
      mockPatientProfileRepo,
      mockUserRepo,
      mockResourceRepo,
      mockAccessService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfile', () => {
    it('should create a patient profile successfully', async () => {
      const mockUser = {
        _id: '123',
        userId: 'PAT-202510-0001',
        name: 'Test Patient',
        email: 'patient@test.com',
        role: 'patient',
        passwordHash: 'hashed',
      };

      const profileData = {
        userId: '123',
        temperature: 37.5,
        bloodPressure: '120/80',
        heartRate: 72,
        totalCharges: 5000,
        paidAmount: 2000,
      };

      const mockProfile = {
        ...profileData,
        _id: 'profile123',
        outstanding: 3000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockPatientProfileRepo.findByUserId.mockResolvedValue(null);
      mockPatientProfileRepo.create.mockResolvedValue(mockProfile);

      const result = await service.createProfile(profileData);

      expect(result).toEqual(mockProfile);
      expect(mockUserRepo.findById).toHaveBeenCalledWith('123');
      expect(mockPatientProfileRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '123',
          temperature: 37.5,
          outstanding: 3000,
        })
      );
    });

    it('should throw error if user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(
        service.createProfile({
          userId: '123',
          temperature: 37.5,
        })
      ).rejects.toThrow('User not found');
    });

    it('should throw error if user is not a patient', async () => {
      const mockUser = {
        _id: '123',
        userId: 'DOC-202510-0001',
        name: 'Dr. Smith',
        email: 'doctor@test.com',
        role: 'doctor',
        passwordHash: 'hashed',
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);

      await expect(
        service.createProfile({
          userId: '123',
          temperature: 37.5,
        })
      ).rejects.toThrow('User must have patient role');
    });

    it('should throw error if profile already exists', async () => {
      const mockUser = {
        _id: '123',
        role: 'patient',
      };

      const existingProfile = {
        _id: 'profile123',
        userId: '123',
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockPatientProfileRepo.findByUserId.mockResolvedValue(existingProfile);

      await expect(
        service.createProfile({
          userId: '123',
          temperature: 37.5,
        })
      ).rejects.toThrow('Patient profile already exists');
    });

    it('should calculate outstanding correctly', async () => {
      const mockUser = {
        _id: '123',
        role: 'patient',
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockPatientProfileRepo.findByUserId.mockResolvedValue(null);
      mockPatientProfileRepo.create.mockImplementation((data: any) => Promise.resolve(data));

      await service.createProfile({
        userId: '123',
        totalCharges: 10000,
        paidAmount: 3500,
      });

      expect(mockPatientProfileRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          outstanding: 6500,
        })
      );
    });
  });

  describe('getProfileByCustomUserId', () => {
    it('should get profile by custom user ID', async () => {
      const mockUser = {
        _id: '123',
        userId: 'PAT-202510-0001',
        name: 'Test Patient',
      };

      const mockProfile = {
        _id: 'profile123',
        userId: '123',
        temperature: 37.0,
      };

      mockUserRepo.findByUserId.mockResolvedValue(mockUser);
      mockPatientProfileRepo.findByUserId.mockResolvedValue(mockProfile);

      const result = await service.getProfileByCustomUserId('PAT-202510-0001');

      expect(result).toEqual(mockProfile);
      expect(mockUserRepo.findByUserId).toHaveBeenCalledWith('PAT-202510-0001');
      expect(mockPatientProfileRepo.findByUserId).toHaveBeenCalledWith('123');
    });

    it('should throw error if user not found', async () => {
      mockUserRepo.findByUserId.mockResolvedValue(null);

      await expect(
        service.getProfileByCustomUserId('PAT-202510-9999')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if profile not found', async () => {
      const mockUser = {
        _id: '123',
        userId: 'PAT-202510-0001',
      };

      mockUserRepo.findByUserId.mockResolvedValue(mockUser);
      mockPatientProfileRepo.findByUserId.mockResolvedValue(null);

      await expect(
        service.getProfileByCustomUserId('PAT-202510-0001')
      ).rejects.toThrow('Patient profile not found');
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const existingProfile = {
        _id: 'profile123',
        userId: '123',
        temperature: 37.0,
        totalCharges: 5000,
        paidAmount: 2000,
      };

      const updateData = {
        temperature: 36.5,
        paidAmount: 3000,
      };

      const updatedProfile = {
        ...existingProfile,
        ...updateData,
        outstanding: 2000,
      };

      mockPatientProfileRepo.findByUserId.mockResolvedValue(existingProfile);
      mockPatientProfileRepo.update.mockResolvedValue(updatedProfile);

      const result = await service.updateProfile('123', updateData);

      expect(result).toEqual(updatedProfile);
      expect(mockPatientProfileRepo.update).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({
          temperature: 36.5,
          outstanding: 2000,
        })
      );
    });

    it('should throw error if profile not found', async () => {
      mockPatientProfileRepo.findByUserId.mockResolvedValue(null);

      await expect(
        service.updateProfile('999', { temperature: 36.5 })
      ).rejects.toThrow('Patient profile not found');
    });

    it('should recalculate outstanding when charges updated', async () => {
      const existingProfile = {
        userId: '123',
        totalCharges: 5000,
        paidAmount: 2000,
      };

      mockPatientProfileRepo.findByUserId.mockResolvedValue(existingProfile);
      // ✅ FIXED: Removed unused 'id' parameter
      mockPatientProfileRepo.update.mockImplementation((_: string, data: any) =>
        Promise.resolve({
          ...existingProfile,
          ...data,
        })
      );

      await service.updateProfile('123', {
        totalCharges: 8000,
      });

      expect(mockPatientProfileRepo.update).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({
          outstanding: 6000,
        })
      );
    });
  });

  describe('deleteProfile', () => {
    it('should delete profile successfully', async () => {
      const mockProfile = {
        _id: 'profile123',
        userId: '123',
      };

      mockPatientProfileRepo.findByUserId.mockResolvedValue(mockProfile);
      mockPatientProfileRepo.delete.mockResolvedValue(undefined);

      await service.deleteProfile('123');

      expect(mockPatientProfileRepo.delete).toHaveBeenCalledWith('123');
    });

    it('should throw error if profile not found', async () => {
      mockPatientProfileRepo.findByUserId.mockResolvedValue(null);

      await expect(service.deleteProfile('123')).rejects.toThrow(
        'Patient profile not found'
      );
    });
  });

  describe('getAllProfiles', () => {
    it('should return all profiles', async () => {
      const mockProfiles = [
        { _id: '1', userId: 'user1', temperature: 37.0 },
        { _id: '2', userId: 'user2', temperature: 36.5 },
      ];

      mockPatientProfileRepo.findAll.mockResolvedValue(mockProfiles);

      const result = await service.getAllProfiles();

      expect(result).toEqual(mockProfiles);
      expect(result).toHaveLength(2);
    });
  });

  describe('isClearedForDischarge', () => {
    it('should return true if discharge date is set', async () => {
      const mockProfile = {
        _id: 'profile123',
        userId: '123',
        dischargeDate: new Date('2025-10-20'),
      };

      mockPatientProfileRepo.findByUserId.mockResolvedValue(mockProfile);

      const result = await service.isClearedForDischarge('123');

      expect(result).toBe(true);
    });

    it('should return false if discharge date is not set', async () => {
      const mockProfile = {
        _id: 'profile123',
        userId: '123',
        dischargeDate: undefined,
      };

      mockPatientProfileRepo.findByUserId.mockResolvedValue(mockProfile);

      const result = await service.isClearedForDischarge('123');

      expect(result).toBe(false);
    });

    it('should throw error if profile not found', async () => {
      mockPatientProfileRepo.findByUserId.mockResolvedValue(null);

      await expect(service.isClearedForDischarge('999')).rejects.toThrow(
        'Patient profile not found'
      );
    });
  });
});