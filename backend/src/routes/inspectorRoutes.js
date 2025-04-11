import express from "express";
import {getAllInspectors,createInspector, getInspector, deleteInspector, updateInspector  } from "../controllers/inspectorController.js";
//import validateRequest from "../middlewares/inputValidatorMiddleware.js";
const router = express.Router();

router.post("/", createInspector);
router.get("/", getAllInspectors);
router.get("/:id", getInspector);
router.put("/inspector/:id", updateInspector);
router.delete("/:id", deleteInspector);

export default router;