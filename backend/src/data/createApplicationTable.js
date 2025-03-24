import pool from "../config/db.js";

const createApplicationTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    standNumber VARCHAR(100) UNIQUE NOT NULL ,
    postalAddress VARCHAR(100) NOT NULL ,
    estimatedCost DECIMAL(15, 2) NOT NULL ,
    constructionType VARCHAR(100) NOT NULL,
    projectDescription TEXT NOT NULL,
    startDate DATE NOT NULL ,
    completionDate DATE NOT NULL ,
    buildingContractor VARCHAR(100) NOT NULL,
    architect VARCHAR(100) NOT NULL ,
    ownerName VARCHAR(100) NOT NULL ,
    email VARCHAR(100) UNIQUE NOT NULL,
    contact VARCHAR(100) NOT NULL,
    purposeOfBuilding TEXT,
    created_at TIMESTAMP DEFAULT NOW()
)
    `;

    try {
      pool.query(queryText);
      console.log("User table created if not exists"); 
    } catch (error) {
      console.log("Error creating users table:", error)  
    }
};

export default createApplicationTable;