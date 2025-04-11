import express from "express";
import {
    getCurrentStage,
    initializeWorkflow,
    updateStage,
    isStageCompleted,
    isStageAccessible,
    getCompletedStages,
    moveToNextStage,
    getWorkflowProgress
} from "../controllers/workflowController.js";
import { protect } from "../controllers/authController.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Application workflow routes
router.get("/applications/:applicationId/stage", getCurrentStage);
router.post("/applications/:applicationId/workflow", initializeWorkflow);
router.put("/applications/:applicationId/stage", roleMiddleware.requireRole('admin', 'inspector'), updateStage);
router.get("/applications/:applicationId/stage/:stage/completed", isStageCompleted);
router.get("/applications/:applicationId/stage/:stage/accessible", isStageAccessible);
router.get("/applications/:applicationId/completed-stages", getCompletedStages);
router.post("/applications/:applicationId/next-stage", moveToNextStage);
router.get("/applications/:applicationId/progress", getWorkflowProgress);

export default router;
