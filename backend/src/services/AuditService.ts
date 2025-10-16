import { IAuditService } from "../core/interfaces/IAuditService";
import { AuditRepository } from "../repositories/AuditRepository";

export class AuditService implements IAuditService{
     constructor(private auditRepo: AuditRepository) {}

     async log(actorId: string, action: string, target: string, details?: any): Promise<void> {
        await this.auditRepo.create({
            actorId,
            action,
            target,
            timestamp: new Date(),
            details
        } as any);
     }
}