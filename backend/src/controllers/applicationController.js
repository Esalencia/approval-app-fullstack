import { createApplicationService, deleteApplicationService, getAllApplicationsService, getApplicationByIdService } from "../models/applicationModel.js";


//Standardized response function
const handleResponse = (res, status, message, data = null) =>{
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const createApplication = async (req, res, next) => {
    // Log the entire request body for debugging
    console.log('Received application data:', req.body);

    // Destructure the request body
    const {
        stand_number,
        postal_address,
        estimated_cost,
        construction_type,
        project_description,
        start_date,
        completion_date,
        building_contractor,
        architect,
        status
    } = req.body;

    try {
        // Validate required fields
        const missingFields = [];
        if (!stand_number) missingFields.push('Stand Number');
        if (!postal_address) missingFields.push('Postal Address');
        if (!estimated_cost) missingFields.push('Estimated Cost');
        if (!construction_type) missingFields.push('Construction Type');
        if (!project_description) missingFields.push('Project Description');
        if (!start_date) missingFields.push('Start Date');
        if (!completion_date) missingFields.push('Completion Date');
        if (!building_contractor) missingFields.push('Building Contractor');
        if (!architect) missingFields.push('Architect');

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Get user ID and details from authenticated user
        const user_id = req.user?.id;

        // Get owner_name from request body or construct from user data
        let owner_name = req.body.owner_name;
        if (!owner_name && req.user) {
            const firstName = req.user.firstName || req.user.first_name || '';
            const lastName = req.user.lastName || req.user.last_name || '';
            owner_name = `${firstName} ${lastName}`.trim();
            // If still empty after trimming, set to 'Not provided'
            if (!owner_name) {
                owner_name = 'Not provided';
            }
        }

        // Get email from request body or user data
        const email = req.body.email || req.user?.email;

        // Get contact_number from request body or user data
        const contact_number = req.body.contact_number || req.user?.contactNumber || req.user?.contact_number || 'Not provided';

        if (!user_id) {
            return handleResponse(res, 401, "Authentication required");
        }

        // Validate user information
        if (!owner_name || owner_name === ' ') {
            throw new Error('Owner name is required');
        }

        if (!email) {
            throw new Error('Email is required');
        }

        if (!contact_number) {
            throw new Error('Contact number is required');
        }

        // Call the service to create the application
        const newApplication = await createApplicationService(
            user_id,
            stand_number,
            postal_address,
            estimated_cost,
            construction_type,
            project_description,
            start_date,
            completion_date,
            building_contractor,
            architect,
            owner_name,
            email,
            contact_number,
            status || 'draft' // Default to draft if not specified
        );

        // Send a success response
        handleResponse(res, 201, "Application submitted successfully", newApplication);
    } catch (err) {
        // Pass the error to the error-handling middleware
        next(err);
    }
};

export const getAllApplications = async (req, res, next) => {
    try{
        const applications = await getAllApplicationsService();
        handleResponse(res, 200, "Applications fetched successfully", applications)
    } catch (err) {
        next(err);
    }
};

export const getApplicationById = async (req, res, next) => {
    try{
        const application = await getApplicationByIdService(req.params.id);
        if (!application) return handleResponse (res, 404, "Application not found");
        handleResponse(res, 200, "Application fetched successfully", application);
    } catch (err) {
        next(err);
    }
};

// export const updateUser = async (req, res, next) => {
//     const {name, email} = req.body;
//     try{
//         const updateduser = await updateUserService(req.params.id, name, email);
//         if (!updateduser) return handleResponse (res, 404, "User not found");
//         handleResponse(res, 200, "User updated successfully", updateduser);
//     } catch (err) {
//         next(err);
//     }
// };

export const deleteApplication = async (req, res, next) => {
    try{
        const deletedApplication = await deleteApplicationService(req.params.id);
        if (!deletedApplication) return handleResponse (res, 404, "User not found");
        handleResponse(res, 200, "User deleted successifully", deletedApplication);
    } catch (err) {
        next(err);
    }
};
