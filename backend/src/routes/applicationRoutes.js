import express from "express";
// import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController.js";
//import validateUser from "../middlewares/inputValidator.js";
import { createApplication, deleteApplication, getAllApplications, getApplicationById } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/application", createApplication);
router.get("/application", getAllApplications);
router.get("/application/:id", getApplicationById);
// router.put("/application/:id", validateUser, updateApplication);
router.delete("/application/:id", deleteApplication);

export default router;