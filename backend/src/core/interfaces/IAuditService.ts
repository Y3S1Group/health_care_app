export interface IAuditService {
  log(actorId: string, action: string, target: string, details?: any): Promise<void>;
}