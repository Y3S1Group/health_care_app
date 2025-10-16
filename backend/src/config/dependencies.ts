import { ResourceController } from "../controllers/ResourceController";
import { AuditRepository } from "../repositories/AuditRepository";
import { HealthcareManagerRepository } from "../repositories/HealthcareManagerRepository";
import { HospitalRepository } from "../repositories/HospitalRepository";
import { HospitalStaffRepository } from "../repositories/HospitalStaffRepository";
import { ResourceAllocationRepository } from "../repositories/ResourceAllocationRepository";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { AuditService } from "../services/AuditService";
import { NotificationService } from "../services/NotificationService";
import { ResourceManagementService } from "../services/ResourceManagementService";
import { ValidationService } from "../services/ValidationService";

const allocationRepo = new ResourceAllocationRepository();
const managerRepo = new HealthcareManagerRepository();
const hospitalRepo = new HospitalRepository();
const staffRepo = new HospitalStaffRepository();
const resourceRepo = new ResourceRepository();
const auditRepo = new AuditRepository();

const auditService = new AuditService(auditRepo);
const validationService = new ValidationService(staffRepo);
const notificationService = new NotificationService();

const resourceManagamentService = new ResourceManagementService(
    allocationRepo,
    managerRepo,
    hospitalRepo,
    staffRepo,
    resourceRepo,
    auditService,
    validationService,
    notificationService
);

export const resourceController = new ResourceController(resourceManagamentService);