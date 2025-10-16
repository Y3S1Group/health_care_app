import { Router } from "express";
import { HospitalStaffRepository } from "../repositories/HospitalStaffRepository";

export const createStaffRoutes = (): Router => {
    const router = Router();
    const staffRepo = new HospitalStaffRepository();

    router.get('/', async (req, res, next) => {
        try {
            const { department } = req.query;
            const staff = department
                ? await staffRepo.findByDepartment(department as string)
                : await staffRepo.findByIds([]);
            
            res.json({ success: true, data: staff });
        } catch (error) {
            next(error);
        }
    });

    router.get('/available/:department', async (req, res, next) => {
        try {
            const staff = await staffRepo.findAvailableStaff(req.params.department, 100);
            res.json({ success: true, data: staff });
        } catch (error) {
            next(error);
        }
    });

    return router;
}