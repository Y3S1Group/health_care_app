export class NotificationService {
    async notifyDepartment(department: string, message: string): Promise<void> {
        console.log(`[NOTIFICATION] Department ${department}: ${message}`);
    }

    async notifyStaff(staffIds: string[], message: string): Promise<void> {
        for (const staffId of staffIds) {
            console.log(`[NOTIFICATION] Staff ${staffId}: ${message}`);
        }
    }
}