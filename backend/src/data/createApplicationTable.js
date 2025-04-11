import pool from "../config/db.js";

const createApplicationTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_stage_id INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_review', 'approved', 'rejected', 'completed')),
    standNumber VARCHAR(100) NOT NULL,
    postalAddress VARCHAR(100) NOT NULL,
    estimatedCost DECIMAL(15, 2) NOT NULL,
    constructionType VARCHAR(100) NOT NULL,
    projectDescription TEXT NOT NULL,
    startDate DATE NOT NULL,
    completionDate DATE NOT NULL,
    buildingContractor VARCHAR(100) NOT NULL,
    architect VARCHAR(100) NOT NULL,
    ownerName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    purposeOfBuilding TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)
    `;

    try {
      pool.query(queryText);
      console.log("Application table created if not exists");
    } catch (error) {
      console.log("Error creating users table:", error)
    }
};

export default createApplicationTable;