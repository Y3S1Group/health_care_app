import { Router } from 'express';
import { ResourceController } from '../controllers/ResourceController';
import { validate } from '../middleware/validator';
import { allocateSchema, reallocateSchema } from '../validators/allocationSchemas';

/**
 * Resource Routes
 * Uses existing validator middleware and Joi schemas
 */
export const createResourceRoutes = (controller: ResourceController): Router => {
  const router = Router();

  // UC04 Step 1: Dashboard
  router.get('/dashboard/:managerID', controller.getDashboard);

  // UC04 Step 2: Patient flow analysis
  router.get('/patient-flow/:managerID', controller.getPatientFlowAnalysis);

  // UC04 Step 2: Department utilization
  router.get('/utilization/:managerID', controller.getDepartmentUtilization);

  // UC04 Step 3: Available resources
  router.get('/available/:managerID', controller.getAvailableResources);

  // UC04 Alt 2a: Detect shortages
  router.get('/shortages/:managerID', controller.detectShortages);

  // UC04 Alt 2a: Suggest reallocation
  router.get('/suggestions/:managerID', controller.getSuggestedReallocation);

  // UC04 Step 5: Allocate resources (Uses YOUR Joi schema)
  router.post(
    '/allocate/:managerID',
    validate(allocateSchema), // YOUR EXISTING JOI VALIDATION
    controller.allocateResources
  );

  // Reallocate resources (Uses YOUR Joi schema)
  router.put(
    '/reallocate/:managerID/:allocationID',
    validate(reallocateSchema), // YOUR EXISTING JOI VALIDATION
    controller.reallocateResources
  );

  // Additional routes
  router.get('/allocations', controller.getAllAllocations);
  router.get('/allocations/:allocationID', controller.getAllocationById);

  return router;
};
