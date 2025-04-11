// db/createUsersTable.js
import pool from "../config/db.js";

const createUsersTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'applicant', 'inspector', 'superadmin')),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        contact_number VARCHAR(20) NOT NULL,
        physical_address TEXT NOT NULL,
        national_id_number VARCHAR(20) UNIQUE NOT NULL,
        reset_password_token VARCHAR(255),
        reset_password_expires TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS applicants (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        -- Add applicant-specific fields here
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS inspectors (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        work_id VARCHAR(50) UNIQUE NOT NULL,
        license_number VARCHAR(50) UNIQUE,
        specialization VARCHAR(100),
        available BOOLEAN NOT NULL DEFAULT TRUE,
        assigned_district VARCHAR(100) NOT NULL,
        inspection_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    `;

    try {
        await pool.query(queryText);
        console.log("Users tables created successfully");
    } catch (error) {
        console.error("Error creating users tables:", error);
        throw error;
    }
};

// Function to create admin users
const createAdminUsers = async () => {
    try {
        // Import bcrypt for password hashing
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.default.genSalt(10);

        // 1. Create super admin if not exists
        const checkSuperAdminQuery = "SELECT * FROM users WHERE role = 'superadmin' LIMIT 1";
        const superAdminResult = await pool.query(checkSuperAdminQuery);

        if (superAdminResult.rows.length === 0) {
            // Hash the password
            const superAdminPasswordHash = await bcrypt.default.hash('admin123', salt);

            // Insert super admin
            const insertSuperAdminQuery = `
                INSERT INTO users (
                    email,
                    password_hash,
                    role,
                    first_name,
                    last_name,
                    contact_number,
                    physical_address,
                    national_id_number
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;

            const superAdminValues = [
                'superadmin@zimbuilds.com',
                superAdminPasswordHash,
                'superadmin',
                'Super',
                'Admin',
                '1234567890',
                'ZimBuilds HQ',
                'SADMIN001'
            ];

            await pool.query(insertSuperAdminQuery, superAdminValues);
            console.log('Super admin created successfully');
        } else {
            console.log('Super admin already exists');
        }

        // 2. Create regular admin if not exists
        const checkAdminQuery = "SELECT * FROM users WHERE role = 'admin' LIMIT 1";
        const adminResult = await pool.query(checkAdminQuery);

        if (adminResult.rows.length === 0) {
            // Hash the password
            const adminPasswordHash = await bcrypt.default.hash('admin123', salt);

            // Insert admin
            const insertAdminQuery = `
                INSERT INTO users (
                    email,
                    password_hash,
                    role,
                    first_name,
                    last_name,
                    contact_number,
                    physical_address,
                    national_id_number
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;

            const adminValues = [
                'admin@zimbuilds.com',
                adminPasswordHash,
                'admin',
                'Regular',
                'Admin',
                '0987654321',
                'ZimBuilds Office',
                'ADMIN001'
            ];

            await pool.query(insertAdminQuery, adminValues);
            console.log('Admin created successfully');
        } else {
            console.log('Admin already exists');
        }
    } catch (error) {
        console.error('Error creating admin users:', error);
    }
};

// Export functions
export { createUsersTable, createAdminUsers };
export default createUsersTable;
