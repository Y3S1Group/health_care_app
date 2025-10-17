import { Request, Response, NextFunction } from 'express';
import { DiagnosisService } from '../services/DiagnosisService';

export class DiagnosisController {
  constructor(private diagnosisService: DiagnosisService) {}

  createDiagnosis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const diagnosis = await this.diagnosisService.createDiagnosis(req.body);

      res.status(201).json({
        success: true,
        message: 'Diagnosis created successfully',
        data: diagnosis,
      });
    } catch (error) {
      next(error);
    }
  };

  getDiagnosisById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const diagnosis = await this.diagnosisService.getDiagnosisById(id);

      res.status(200).json({
        success: true,
        data: diagnosis,
      });
    } catch (error) {
      next(error);
    }
  };

  getDiagnosesByPatientId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patientId } = req.params;
      const diagnoses = await this.diagnosisService.getDiagnosesByPatientId(patientId);

      res.status(200).json({
        success: true,
        data: diagnoses,
      });
    } catch (error) {
      next(error);
    }
  };

  updateDiagnosis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const diagnosis = await this.diagnosisService.updateDiagnosis(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Diagnosis updated successfully',
        data: diagnosis,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteDiagnosis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.diagnosisService.deleteDiagnosis(id);

      res.status(200).json({
        success: true,
        message: 'Diagnosis deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // ADD these methods to DiagnosisController class

createDiagnosisByCustomUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const diagnosis = await this.diagnosisService.createDiagnosisByCustomUserId(req.body);

    res.status(201).json({
      success: true,
      message: 'Diagnosis created successfully',
      data: diagnosis,
    });
  } catch (error) {
    next(error);
  }
};

getDiagnosesByCustomUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customUserId } = req.params;
    const diagnoses = await this.diagnosisService.getDiagnosesByCustomUserId(customUserId);

    res.status(200).json({
      success: true,
      data: diagnoses,
    });
  } catch (error) {
    next(error);
  }
};
}