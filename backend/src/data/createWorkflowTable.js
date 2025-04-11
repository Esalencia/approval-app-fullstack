import pool from "../config/db.js";

const createWorkflowTable = async () => {
    try {
        // Check if table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'application_workflow'
            );
        `);
        
        if (tableCheck.rows[0].exists) {
            console.log("Application workflow table already exists");
            return;
        }
        
        // Create the table
        await pool.query(`
            CREATE TABLE application_workflow (
                id SERIAL PRIMARY KEY,
                application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
                current_stage INTEGER NOT NULL DEFAULT 1,
                started_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                completed_at TIMESTAMP,
                UNIQUE(application_id)
            );
        `);
        
        console.log("Application workflow table created successfully");
    } catch (error) {
        console.error("Error creating application workflow table:", error);
        throw error;
    }
};

export default createWorkflowTable;
