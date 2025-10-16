import { Router } from "express";
import { HospitalRepository } from "../repositories/HospitalRepository";

export const createHospitalRoutes = (): Router => {
    const router = Router();
    const hospitalRepo = new HospitalRepository();

    router.get('/', async (req, res, next) => {
        try {
            const hospitals = await hospitalRepo.findAll();
            res.json({ success: true, data: hospitals });
        } catch (error) {
            next(error);
        }
    });
    
    return router;
}