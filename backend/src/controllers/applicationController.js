import { createApplicationService, deleteApplicationService, getAllApplicationsService, getApplicationByIdService } from "../models/applicationModel.js";
// import { createUserService, deleteUserService, getAllUsersService, getUserByIdService, updateUserService } from "../models/userModels.js";

//Standardized response function
const handleResponse = (res, status, message, data = null) =>{
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const createApplication = async (req, res, next) => {
    // Destructure the request body
    const {
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
    } = req.body;

    try {
        // Validate required fields
        if (!standNumber || !postalAddress || !estimatedCost || !constructionType || !projectDescription || !startDate || !completionDate || !buildingContractor || !architect || !ownerName || !email || !contact) {
            throw new Error("Missing required fields");
        }

        // Call the service to create the application
        const newApplication = await createApplicationService(
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
