import pool from "../config/db.js";

// Define the workflow stages and their order
export const WORKFLOW_STAGES = {
    APPLICATION_FORM: 1,
    DOCUMENT_VERIFICATION: 2,
    PAYMENT: 3,
    INSPECTION_SCHEDULING: 4,
    INSPECTIONS: 5,
    CERTIFICATE: 6
};

// Get the current workflow stage for an application
export const getCurrentStageService = async (applicationId) => {
    const query = `
        SELECT current_stage 
        FROM application_workflow 
        WHERE application_id = $1
    `;
    
    try {
        const result = await pool.query(query, [applicationId]);
        if (result.rows.length === 0) {
            // If no workflow exists, create one at the first stage
            return await initializeWorkflowService(applicationId);
        }
        return result.rows[0].current_stage;
    } catch (error) {
        console.error("Error getting current stage:", error);
        throw error;
    }
};

// Initialize a new workflow for an application
export const initializeWorkflowService = async (applicationId) => {
    const query = `
        INSERT INTO application_workflow (
            application_id, 
            current_stage, 
            started_at
        ) VALUES ($1, $2, NOW())
        RETURNING current_stage
    `;
    
    try {
        const result = await pool.query(query, [applicationId, WORKFLOW_STAGES.APPLICATION_FORM]);
        return result.rows[0].current_stage;
    } catch (error) {
        console.error("Error initializing workflow:", error);
        throw error;
    }
};

// Update the workflow stage for an application
export const updateStageService = async (applicationId, newStage) => {
    const query = `
        UPDATE application_workflow 
        SET 
            current_stage = $1,
            updated_at = NOW()
        WHERE application_id = $2
        RETURNING *
    `;
    
    try {
        const result = await pool.query(query, [newStage, applicationId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating stage:", error);
        throw error;
    }
};

// Check if a stage is completed for an application
export const isStageCompletedService = async (applicationId, stage) => {
    const currentStage = await getCurrentStageService(applicationId);
    return currentStage > stage;
};

// Check if a stage is accessible for an application
export const isStageAccessibleService = async (applicationId, stage) => {
    const currentStage = await getCurrentStageService(applicationId);
    
    // Current stage and previous stages are accessible
    return stage <= currentStage;
};

// Get all completed stages for an application
export const getCompletedStagesService = async (applicationId) => {
    const currentStage = await getCurrentStageService(applicationId);
    
    const completedStages = [];
    for (const [stageName, stageNumber] of Object.entries(WORKFLOW_STAGES)) {
        if (stageNumber < currentStage) {
            completedStages.push(stageName);
        }
    }
    
    return completedStages;
};

// Move to the next stage if current stage is completed
export const moveToNextStageService = async (applicationId) => {
    const currentStage = await getCurrentStageService(applicationId);
    
    // If already at the last stage, do nothing
    if (currentStage >= WORKFLOW_STAGES.CERTIFICATE) {
        return { success: false, message: "Already at the final stage" };
    }
    
    // Move to the next stage
    const newStage = currentStage + 1;
    await updateStageService(applicationId, newStage);
    
    return { 
        success: true, 
        previousStage: currentStage,
        currentStage: newStage
    };
};

// Get workflow progress for an application
export const getWorkflowProgressService = async (applicationId) => {
    const currentStage = await getCurrentStageService(applicationId);
    const totalStages = Object.keys(WORKFLOW_STAGES).length;
    
    // Calculate progress percentage
    const progress = Math.round((currentStage / totalStages) * 100);
    
    // Get stage name
    const stageName = Object.keys(WORKFLOW_STAGES).find(
        key => WORKFLOW_STAGES[key] === currentStage
    );
    
    return {
        applicationId,
        currentStage,
        stageName,
        totalStages,
        progress,
        completedStages: await getCompletedStagesService(applicationId)
    };
};
