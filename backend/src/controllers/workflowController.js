import {
    WORKFLOW_STAGES,
    getCurrentStageService,
    initializeWorkflowService,
    updateStageService,
    isStageCompletedService,
    isStageAccessibleService,
    getCompletedStagesService,
    moveToNextStageService,
    getWorkflowProgressService
} from "../models/workflowModel.js";

// Get the current workflow stage for an application
export const getCurrentStage = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        const currentStage = await getCurrentStageService(applicationId);
        
        res.status(200).json({
            success: true,
            currentStage,
            stageName: Object.keys(WORKFLOW_STAGES).find(
                key => WORKFLOW_STAGES[key] === currentStage
            )
        });
    } catch (error) {
        console.error("Error getting current stage:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get current stage",
            error: error.message
        });
    }
};

// Initialize a new workflow for an application
export const initializeWorkflow = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        const currentStage = await initializeWorkflowService(applicationId);
        
        res.status(200).json({
            success: true,
            message: "Workflow initialized successfully",
            currentStage,
            stageName: Object.keys(WORKFLOW_STAGES).find(
                key => WORKFLOW_STAGES[key] === currentStage
            )
        });
    } catch (error) {
        console.error("Error initializing workflow:", error);
        res.status(500).json({
            success: false,
            message: "Failed to initialize workflow",
            error: error.message
        });
    }
};

// Update the workflow stage for an application
export const updateStage = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { newStage } = req.body;
        
        // Validate the new stage
        if (!Object.values(WORKFLOW_STAGES).includes(newStage)) {
            return res.status(400).json({
                success: false,
                message: "Invalid stage"
            });
        }
        
        const result = await updateStageService(applicationId, newStage);
        
        res.status(200).json({
            success: true,
            message: "Stage updated successfully",
            workflow: result
        });
    } catch (error) {
        console.error("Error updating stage:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update stage",
            error: error.message
        });
    }
};

// Check if a stage is completed for an application
export const isStageCompleted = async (req, res) => {
    try {
        const { applicationId, stage } = req.params;
        
        // Convert stage name to number if needed
        const stageNumber = isNaN(stage) ? WORKFLOW_STAGES[stage] : parseInt(stage);
        
        if (!stageNumber) {
            return res.status(400).json({
                success: false,
                message: "Invalid stage"
            });
        }
        
        const completed = await isStageCompletedService(applicationId, stageNumber);
        
        res.status(200).json({
            success: true,
            completed
        });
    } catch (error) {
        console.error("Error checking stage completion:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check stage completion",
            error: error.message
        });
    }
};

// Check if a stage is accessible for an application
export const isStageAccessible = async (req, res) => {
    try {
        const { applicationId, stage } = req.params;
        
        // Convert stage name to number if needed
        const stageNumber = isNaN(stage) ? WORKFLOW_STAGES[stage] : parseInt(stage);
        
        if (!stageNumber) {
            return res.status(400).json({
                success: false,
                message: "Invalid stage"
            });
        }
        
        const accessible = await isStageAccessibleService(applicationId, stageNumber);
        
        res.status(200).json({
            success: true,
            accessible
        });
    } catch (error) {
        console.error("Error checking stage accessibility:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check stage accessibility",
            error: error.message
        });
    }
};

// Get all completed stages for an application
export const getCompletedStages = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        const completedStages = await getCompletedStagesService(applicationId);
        
        res.status(200).json({
            success: true,
            completedStages
        });
    } catch (error) {
        console.error("Error getting completed stages:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get completed stages",
            error: error.message
        });
    }
};

// Move to the next stage if current stage is completed
export const moveToNextStage = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        const result = await moveToNextStageService(applicationId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.status(200).json({
            success: true,
            message: "Moved to next stage successfully",
            previousStage: result.previousStage,
            currentStage: result.currentStage,
            stageName: Object.keys(WORKFLOW_STAGES).find(
                key => WORKFLOW_STAGES[key] === result.currentStage
            )
        });
    } catch (error) {
        console.error("Error moving to next stage:", error);
        res.status(500).json({
            success: false,
            message: "Failed to move to next stage",
            error: error.message
        });
    }
};

// Get workflow progress for an application
export const getWorkflowProgress = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        const progress = await getWorkflowProgressService(applicationId);
        
        res.status(200).json({
            success: true,
            progress
        });
    } catch (error) {
        console.error("Error getting workflow progress:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get workflow progress",
            error: error.message
        });
    }
};
