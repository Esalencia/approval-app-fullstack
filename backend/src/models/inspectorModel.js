import pool from "../config/db.js";
import bcrypt from 'bcryptjs';

const saltRounds = 10;

export const getAllInspectorsService = async () => {
    try {
        // Join with users table to get user details
        const query = `
            SELECT i.*, u.email, u.first_name, u.last_name, u.contact_number, u.physical_address
            FROM inspectors i
            JOIN users u ON i.user_id = u.id
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        throw new Error(`Failed to fetch inspectors: ${err.message}`);
    }
};

export const getInspectorByIdService = async (id) => {
    try {
        const query = `
            SELECT i.*, u.email, u.first_name, u.last_name, u.contact_number, u.physical_address
            FROM inspectors i
            JOIN users u ON i.user_id = u.id
            WHERE i.user_id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (err) {
        throw new Error(`Failed to fetch inspector: ${err.message}`);
    }
};

export const createInspectorService = async (inspectorData) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Hash password
        const hashedPassword = await bcrypt.hash(inspectorData.password, saltRounds);

        // First create user
        const userQuery = `
            INSERT INTO users (
                email, password_hash, role, first_name, last_name, 
                contact_number, physical_address, national_id_number
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id;
        `;
        
        const userValues = [
            inspectorData.email,
            hashedPassword,
            'inspector',
            inspectorData.first_name,
            inspectorData.last_name,
            inspectorData.contact_number,
            inspectorData.physical_address,
            inspectorData.national_id_number
        ];

        const userResult = await client.query(userQuery, userValues);
        const userId = userResult.rows[0].id;

        // Then create inspector
        const inspectorQuery = `
            INSERT INTO inspectors (
                user_id, work_id, license_number, specialization,
                available, assigned_district, inspection_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const inspectorValues = [
            userId,
            inspectorData.work_id,
            inspectorData.license_number,
            inspectorData.specialization,
            inspectorData.available || true,
            inspectorData.assigned_district,
            inspectorData.inspection_type
        ];

        const inspectorResult = await client.query(inspectorQuery, inspectorValues);
        
        await client.query('COMMIT');
        
        // Combine user and inspector data in response
        return {
            ...userResult.rows[0],
            ...inspectorResult.rows[0]
        };
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Failed to create inspector: ${err.message}`);
    } finally {
        client.release();
    }
};

export const updateInspectorService = async (id, updateData) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Update user table if user fields are present
        if (updateData.first_name || updateData.last_name || updateData.contact_number) {
            const userQuery = `
                UPDATE users SET
                    first_name = COALESCE($2, first_name),
                    last_name = COALESCE($3, last_name),
                    contact_number = COALESCE($4, contact_number),
                    updated_at = NOW()
                WHERE id = $1
            `;
            await client.query(userQuery, [
                id,
                updateData.first_name,
                updateData.last_name,
                updateData.contact_number
            ]);
        }

        // Update inspector table
        const inspectorQuery = `
            UPDATE inspectors SET
                work_id = COALESCE($2, work_id),
                license_number = COALESCE($3, license_number),
                specialization = COALESCE($4, specialization),
                available = COALESCE($5, available),
                assigned_district = COALESCE($6, assigned_district),
                inspection_type = COALESCE($7, inspection_type),
                updated_at = NOW()
            WHERE user_id = $1
            RETURNING *;
        `;

        const result = await client.query(inspectorQuery, [
            id,
            updateData.work_id,
            updateData.license_number,
            updateData.specialization,
            updateData.available,
            updateData.assigned_district,
            updateData.inspection_type
        ]);

        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Failed to update inspector: ${err.message}`);
    } finally {
        client.release();
    }
};

export const deleteInspectorService = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // This will cascade delete from inspectors table due to the foreign key constraint
        const result = await client.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );
        
        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Failed to delete inspector: ${err.message}`);
    } finally {
        client.release();
    }
};