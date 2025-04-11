import express from "express";
// import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController.js";
//import validateUser from "../middlewares/inputValidator.js";
import { createApplication, deleteApplication, getAllApplications, getApplicationById } from "../controllers/applicationController.js";
import validateRequest from "../middlewares/inputValidatorMiddleware.js";

const router = express.Router();

router.post("/", validateRequest, createApplication);
router.get("/", getAllApplications);
router.get("/:id", getApplicationById);
// router.put("/application/:id", validateUser, updateApplication);
router.delete("/:id", deleteApplication);

export default router;