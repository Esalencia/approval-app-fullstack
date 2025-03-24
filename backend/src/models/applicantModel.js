// import pool from "../config/db.js";

// export const getAllApplicantsService = async () => {
//     const result = await pool.query("SELECT * FROM applicants");
//     return result.rows;
// };
// export const getApplicantByIdService = async (id) => {
//     const result = await pool.query("SELECT * FROM applicants where id = $1", [id]);
//     return result.rows[0]
// };
// export const createApplicantService = async (firstName, lastName, email, telNumber, address) => {
//     const result = await pool.query("INSERT INTO users (firstName, lastName, email, telNumber, address) VALUES ($1, $2) RETURNING *",
//      [firstName, lastName, email, telNumber, address]
//     );
//      return result.rows[0]
// };
// export const updateApplicantService = async (id, firstName, lastName, email, telNumber, address) => {
//     const result = await pool.query("UPDATE users SET name=$1, eamil=$2 WHERE id=$3 RETURNING *",
//         [firstName, lastName, email, telNumber, address, id]
//     );
//     return result.rows[0]
// };
// export const deleteUserService = async (id) => {
//     const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING*",
//         [id]
//     );
//     return result.rows[0]
// };