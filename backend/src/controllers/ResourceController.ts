
import { Request, Response, NextFunction } from 'express';
import { ResourceManagementService } from '../services/ResourceManagementService';
import { logger } from '../config/logger';

/**
 * ResourceController - Handles UC04 HTTP requests
 * Uses existing errorHandler middleware
 */
export class ResourceController {
    constructor(private resourceService: ResourceManagementService) { }

    // UC04 Step 1: Access dashboard
    getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { managerID } = req.params;

            logger.info(`Manager ${managerID} accessed resource allocation dashboard`);

            res.status(200).json({
                success: true,
                message: 'Resource allocation dashboard loaded',
                data: {
                    managerID,
                    availableActions: [
                        'View Patient Flow Analysis',
                        'View Department Utilization',
                        'Detect Shortages',
                        'Allocate Resources',
                        'Reallocate Resources'
                    ]
                }
            });
        } catch (error) {
            next(error); 
        }
    };

    // UC04 Step 2: Get patient flow analysis
    getPatientFlowAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { managerID } = req.params;

            logger.info(`Fetching patient flow analysis for manager ${managerID}`);

            const flowAnalysis = await this.resourceService.getPatientFlowAnalysis(managerID);

            res.status(200).json({
                success: true,
                message: 'Patient flow analysis retrieved successfully',
                data: flowAnalysis
            });
        } catch (error) {
            next(error);
        }
    };

    // UC04 Step 2: Get department utilization
    getDepartmentUtilization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { managerID } = req.params;

            logger.info(`Fetching department utilization for manager ${managerID}`);

            const utilization = await this.resourceService.getDepartmentUtilization(managerID);

            res.status(200).json({
                success: true,
                message: 'Department utilization data retrieved successfully',
                data: utilization
            });
        } catch (error) {
            next(error);
        }
    };

    // UC04 Step 3: Get available resources
    getAvailableResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { managerID } = req.params;

            logger.info(`Manager ${managerID} reviewing available resources`);

            const flowAnalysis = await this.resourceService.getPatientFlowAnalysis(managerID);
            const utilization = await this.resourceService.getDepartmentUtilization(managerID);

            res.status(200).json({
                success: true,
                message: 'Available resources retrieved successfully',
                data: {
                    patientFlow: flowAnalysis,
                    departmentUtilization: utilization,
                    reviewedAt: new Date()
                }
            });
        } catch (error) {
            next(error);
        }
    };

    // UC04 Alt 2a: Detect shortages
    detectShortages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { managerID } = req.params;

            logger.info(`Detecting shortages for manager ${managerID}`);

            const shortages = await this.resourceService.detectShortages(managerID);

            res.status(200).json({
                success: true,
                message: shortages.hasShortages
                    ? 'Resource shortages detected'
                    : 'No shortages detected',
                data: shortages
            });
        } catch (error) {
            next(error);
        }
    };

    // UC04 Alt 2a: Get suggested reallocation
    getSuggestedReallocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { managerID } = req.params;

            logger.info(`Getting reallocation suggestions for manager ${managerID}`);

            const suggestions = await this.resourceService.suggestReallocation(managerID);

            res.status(200).json({
                success: true,
                message: suggestions.suggestions.length > 0
                    ? 'Reallocation suggestions generated'
                    : 'No reallocation needed',
                data: suggestions
            });
        } catch (error) {
            next(error);
        }
    };

    // Allocate resources (Uses Joi schema validation)
    allocateResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { managerID } = req.params;
            const { hospitalID, department, staffIds, bedCount, equipment } = req.body;

            logger.info(`Manager ${managerID} allocating resources to ${department}`);

            const allocation = await this.resourceService.allocateResources(
                managerID,
                hospitalID,
                department,
                staffIds,
                bedCount,
                equipment || []
            );

            res.status(201).json({
                success: true,
                message: 'Resources allocated successfully',
                data: {
                    allocation,
                    notificationSent: true
                }
            });
        } catch (error) {
            next(error);
        }
    };

    // Reallocate resources
    reallocateResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { managerID, allocationID } = req.params;
            const { staffIds, bedCount, equipment } = req.body;

            logger.info(`Manager ${managerID} reallocating resources for allocation ${allocationID}`);

            const allocation = await this.resourceService.reallocateResources(
                managerID,
                allocationID,
                staffIds,
                bedCount,
                equipment
            );

            res.status(200).json({
                success: true,
                message: 'Resources reallocated successfully',
                data: allocation
            });
        } catch (error) {
            next(error);
        }
    };

    // Get all allocations
    getAllAllocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const allocations = await this.resourceService.getAllAllocations();

            res.status(200).json({
                success: true,
                data: allocations
            });
        } catch (error) {
            next(error);
        }
    };

    // Get allocation by ID
    getAllocationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { allocationID } = req.params;
            const allocation = await this.resourceService.getAllocationById(allocationID);

            res.status(200).json({
                success: true,
                data: allocation
            });
        } catch (error) {
            next(error);
        }
    };
}