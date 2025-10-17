import { Request, Response, NextFunction } from 'express';
import { PrescriptionService } from '../services/PrescriptionService';

export class PrescriptionController {
  constructor(private prescriptionService: PrescriptionService) {}

  createPrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const prescription = await this.prescriptionService.createPrescription(req.body);

      res.status(201).json({
        success: true,
        message: 'Prescription created successfully',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  };

  getPrescriptionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const prescription = await this.prescriptionService.getPrescriptionById(id);

      res.status(200).json({
        success: true,
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  };

  getPrescriptionsByPatientId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patientId } = req.params;
      const prescriptions = await this.prescriptionService.getPrescriptionsByPatientId(patientId);

      res.status(200).json({
        success: true,
        data: prescriptions,
      });
    } catch (error) {
      next(error);
    }
  };

  getActivePrescriptionsByPatientId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patientId } = req.params;
      const prescriptions = await this.prescriptionService.getActivePrescriptionsByPatientId(patientId);

      res.status(200).json({
        success: true,
        data: prescriptions,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const prescription = await this.prescriptionService.updatePrescription(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Prescription updated successfully',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  };

  deletePrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.prescriptionService.deletePrescription(id);

      res.status(200).json({
        success: true,
        message: 'Prescription deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // ADD these methods to PrescriptionController class

createPrescriptionByCustomUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const prescription = await this.prescriptionService.createPrescriptionByCustomUserId(req.body);

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

getPrescriptionsByCustomUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customUserId } = req.params;
    const prescriptions = await this.prescriptionService.getPrescriptionsByCustomUserId(customUserId);

    res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

getActivePrescriptionsByCustomUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customUserId } = req.params;
    const prescriptions = await this.prescriptionService.getActivePrescriptionsByCustomUserId(customUserId);

    res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};
}