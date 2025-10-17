import { ResourceController } from "../controllers/ResourceController";
import { AuditRepository } from "../repositories/AuditRepository";
import { UserRepository } from "../repositories/UserRepository"; // ✅ use UserRepo instead
import { HospitalRepository } from "../repositories/HospitalRepository";
import { HospitalStaffRepository } from "../repositories/HospitalStaffRepository";
import { ResourceAllocationRepository } from "../repositories/ResourceAllocationRepository";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { AuditService } from "../services/AuditService";
import { NotificationService } from "../services/NotificationService";
import { ResourceManagementService } from "../services/ResourceManagementService";
import { ValidationService } from "../services/ValidationService";

// ✅ Instantiate repositories
const allocationRepo = new ResourceAllocationRepository();
const userRepo = new UserRepository(); // replaces HealthcareManagerRepository
const hospitalRepo = new HospitalRepository();
const staffRepo = new HospitalStaffRepository();
const resourceRepo = new ResourceRepository();
const auditRepo = new AuditRepository();

// ✅ Core services
const auditService = new AuditService(auditRepo);
const validationService = new ValidationService(staffRepo);
const notificationService = new NotificationService();

// ✅ Inject the correct repositories into the service
const resourceManagementService = new ResourceManagementService(
  allocationRepo,
  userRepo, // ✅ now uses UserRepository (supports findByUserId)
  hospitalRepo,
  staffRepo,
  resourceRepo,
  auditService,
  validationService,
  notificationService
);

// ✅ Export controller with the updated service
export const resourceController = new ResourceController(resourceManagementService);
