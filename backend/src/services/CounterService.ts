import { CounterModel } from '../models/Counter';

export class CounterService {
  /**
   * Generate unique ID based on role
   * Format: ROLE-YYYYMM-XXXX
   * Examples: 
   * - PAT-202510-0001 (Patient)
   * - DOC-202510-0001 (Doctor)
   * - NUR-202510-0001 (Nurse)
   * - ADM-202510-0001 (Admin)
   * - MGR-202510-0001 (Manager)
   * - STF-202510-0001 (Staff)
   */
  async generateUserId(role: string): Promise<string> {
    const rolePrefix = this.getRolePrefix(role);
    const yearMonth = this.getCurrentYearMonth();
    const counterName = `user_${role}_${yearMonth}`;

    // Get and increment counter atomically
    const counter = await CounterModel.findOneAndUpdate(
      { name: counterName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const sequenceNumber = counter.seq.toString().padStart(4, '0');
    return `${rolePrefix}-${yearMonth}-${sequenceNumber}`;
  }

  private getRolePrefix(role: string): string {
    const prefixes: { [key: string]: string } = {
      patient: 'PAT',
      doctor: 'DOC',
      nurse: 'NUR',
      admin: 'ADM',
      manager: 'MGR',
      staff: 'STF',
    };
    return prefixes[role.toLowerCase()] || 'USR';
  }

  private getCurrentYearMonth(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}${month}`;
  }

  /**
   * Alternative: Simple sequential ID
   * Format: ROLE-XXXXXX
   * Example: PAT-000001, DOC-000001
   */
  async generateSimpleUserId(role: string): Promise<string> {
    const rolePrefix = this.getRolePrefix(role);
    const counterName = `user_${role}_simple`;

    const counter = await CounterModel.findOneAndUpdate(
      { name: counterName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const sequenceNumber = counter.seq.toString().padStart(6, '0');
    return `${rolePrefix}-${sequenceNumber}`;
  }

  /**
   * Alternative: Random alphanumeric ID
   * Format: ROLE-XXXXX (random)
   * Example: PAT-A3X9Z, DOC-K5M2P
   */
  generateRandomUserId(role: string, length: number = 5): string {
    const rolePrefix = this.getRolePrefix(role);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomStr = '';
    
    for (let i = 0; i < length; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `${rolePrefix}-${randomStr}`;
  }
}