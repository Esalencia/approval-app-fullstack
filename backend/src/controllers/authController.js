import {
    registerUserService,
    loginUserService,
    getUserByIDService,
    getAllUsersService,
    updateUserRoleService,
    deleteUserService,
    updatePasswordService,
    resetPasswordTokenService,
    getUserByResetTokenService,
    clearResetTokenService,
    getUserByEmailService
} from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// import { sendPasswordResetEmail } from "../utils/emailService.js";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const register = async (req, res) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            contactNumber,
            physicalAddress,
            nationalIdNumber
        } = req.body;

        // Check if user already exists
        const existingUser = await getUserByEmailService(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user with role explicitly set to 'applicant'
        // Inspectors can only be added by admin users
        const newUser = await registerUserService(
            email,
            passwordHash,
            firstName,
            lastName,
            contactNumber,
            physicalAddress,
            nationalIdNumber,
            'applicant' // Explicitly set role to applicant
        );

        // Format user data for frontend (convert snake_case to camelCase)
        const userData = {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            contactNumber: newUser.contact_number,
            physicalAddress: newUser.physical_address,
            nationalIdNumber: newUser.national_id_number,
            createdAt: newUser.created_at,
            updatedAt: newUser.updated_at
        };

        res.status(201).json({
            message: "User registered successfully",
            user: userData
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for email: ${email}`);

        // Special case for admin@zimbuilds.com
        if (email.toLowerCase() === 'admin@zimbuilds.com') {
            console.log('Admin login attempt detected');

            // Check if admin exists
            let adminUser = await loginUserService(email);

            // If admin doesn't exist, create it
            if (!adminUser) {
                console.log('Admin user not found, creating admin account');
                // Hash password
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);

                // Create admin user
                adminUser = await registerUserService(
                    'admin@zimbuilds.com',
                    passwordHash,
                    'Admin',
                    'User',
                    '123456789',
                    'Admin Office',
                    'ADMIN123',
                    'admin' // Set role to admin
                );
                console.log('Admin user created successfully');
            }

            // For admin, if it's the default admin email, we'll be more lenient with password
            // This is just for development/testing - in production you'd want proper security
            let isPasswordValid = false;
            try {
                isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
            } catch (error) {
                console.error('Password comparison error:', error);
            }

            // If password is invalid but it's the admin email with password 'admin', accept it
            if (!isPasswordValid && password === 'admin') {
                console.log('Using default admin password');
                // Update admin password to 'admin'
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash('admin', salt);
                await updatePasswordService(adminUser.id, passwordHash);
                isPasswordValid = true;
            }

            if (!isPasswordValid) {
                console.log('Admin password invalid');
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Create token for admin
            const token = jwt.sign(
                { id: adminUser.id, role: 'admin' },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Format admin data
            const userData = {
                id: adminUser.id,
                email: adminUser.email,
                role: 'admin',
                firstName: adminUser.first_name || 'Admin',
                lastName: adminUser.last_name || 'User',
                contactNumber: adminUser.contact_number || '123456789',
                physicalAddress: adminUser.physical_address || 'Admin Office',
                nationalIdNumber: adminUser.national_id_number || 'ADMIN123',
                createdAt: adminUser.created_at,
                updatedAt: adminUser.updated_at
            };

            console.log('Admin login successful');
            return res.status(200).json({
                message: "Login successful",
                token,
                user: userData,
                role: 'admin'
            });
        }

        // Normal user login flow
        console.log('Regular user login flow');
        const user = await loginUserService(email);
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log(`User found with role: ${user.role}`);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            console.log('Password invalid');
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log('Password valid');

        // Create JWT token with user role for role-based access control
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Format user data for frontend (convert snake_case to camelCase)
        const userData = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            contactNumber: user.contact_number,
            physicalAddress: user.physical_address,
            nationalIdNumber: user.national_id_number,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        };

        res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
            role: user.role // Explicitly include role in response for frontend routing
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await getUserByIDService(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Format user data for frontend (convert snake_case to camelCase)
        const userData = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            contactNumber: user.contact_number,
            physicalAddress: user.physical_address,
            nationalIdNumber: user.national_id_number,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        // Only admin can access all users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const users = await getAllUsersService();

        // Format user data for frontend (convert snake_case to camelCase)
        const formattedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            contactNumber: user.contact_number,
            physicalAddress: user.physical_address,
            nationalIdNumber: user.national_id_number,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        // Only admin can update roles
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        if (!['applicant', 'inspector', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        const updatedUser = await updateUserRoleService(id, role);

        // Format user data for frontend (convert snake_case to camelCase)
        const userData = {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            contactNumber: updatedUser.contact_number,
            physicalAddress: updatedUser.physical_address,
            nationalIdNumber: updatedUser.national_id_number,
            createdAt: updatedUser.created_at,
            updatedAt: updatedUser.updated_at
        };

        res.status(200).json({
            message: "User role updated successfully",
            user: userData
        });
    } catch (error) {
        console.error("Update role error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        // Only admin can delete users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const { id } = req.params;
        const deletedUser = await deleteUserService(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Format user data for frontend (convert snake_case to camelCase)
        const userData = {
            id: deletedUser.id,
            email: deletedUser.email,
            role: deletedUser.role,
            firstName: deletedUser.first_name,
            lastName: deletedUser.last_name,
            contactNumber: deletedUser.contact_number,
            physicalAddress: deletedUser.physical_address,
            nationalIdNumber: deletedUser.national_id_number,
            createdAt: deletedUser.created_at,
            updatedAt: deletedUser.updated_at
        };

        res.status(200).json({
            message: "User deleted successfully",
            user: userData
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get user
        const user = await getUserByIDService(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        await updatePasswordService(userId, newPasswordHash);

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await getUserByEmailService(email);
        if (!user) {
            // Don't reveal whether user exists for security
            return res.status(200).json({ message: "If the email exists, a reset link will be sent" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to database
        await resetPasswordTokenService(user.id, resetToken, expiresAt);

        // TODO: Uncomment and implement email service
        // Send email with reset link
        // await sendPasswordResetEmail(user.email, resetToken);

        // For now, return the token in the response (only for development)
        res.status(200).json({
            message: "Password reset link sent to email",
            resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Find user by valid token
        const user = await getUserByResetTokenService(token);
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update password and clear token
        await updatePasswordService(user.id, newPasswordHash);
        await clearResetTokenService(user.id);

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Middleware to protect routes
export const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from token
        const currentUser = await getUserByIDService(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: "User belonging to this token no longer exists" });
        }

        // Format user data for middleware (convert snake_case to camelCase)
        const userData = {
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role,
            firstName: currentUser.first_name,
            lastName: currentUser.last_name,
            contactNumber: currentUser.contact_number,
            physicalAddress: currentUser.physical_address,
            nationalIdNumber: currentUser.national_id_number,
            createdAt: currentUser.created_at,
            updatedAt: currentUser.updated_at
        };

        // Attach user to request
        req.user = userData;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

// Middleware to restrict to specific roles
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to perform this action"
            });
        }
        next();
    };
};