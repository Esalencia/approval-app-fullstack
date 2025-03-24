import pool from "../config/db.js";

export const getAllApplicationsService = async () => {
    const result = await pool.query("SELECT * FROM applications");
    return result.rows;
};
export const getApplicationByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM applications where id = $1", [id]);
    return result.rows[0]
};

export const createApplicationService = async (
    standNumber,
    postalAddress,
    estimatedCost,
    constructionType,
    projectDescription,
    startDate,
    completionDate,
    buildingContractor,
    architect,
    ownerName,
    email,
    contact,
    purposeOfBuilding
) => {
    const query = `
        INSERT INTO applications (
            standNumber, postalAddress, estimatedCost, constructionType,
            projectDescription, startDate, completionDate, buildingContractor,
            architect, ownerName, email, contact, purposeOfBuilding
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *;
    `;

    const values = [
        standNumber,
        postalAddress,
        estimatedCost,
        constructionType,
        projectDescription,
        startDate,
        completionDate,
        buildingContractor,
        architect,
        ownerName,
        email,
        contact,
        purposeOfBuilding
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0]; // Return the newly created application
    } catch (err) {
        throw new Error(`Database error: ${err.message}`);
    }
};
// export const updateApplicationService = async (id, standNumber, postalAddress, estimatedCost, constructionType, projectDescription, startDate, completionDate, buildingContractor, architect, ownerName, email, contact, purposeOfBuilding) => {
//     const result = await pool.query("UPDATE applications SET name=$1, eamil=$2 WHERE id=$3 RETURNING *",
//         [firstName, lastName, email, telNumber, address, id]
//     );
//     return result.rows[0]
// };
export const deleteApplicationService = async (id) => {
    const result = await pool.query("DELETE FROM applications WHERE id = $1 RETURNING*",
        [id]
    );
    return result.rows[0]
};