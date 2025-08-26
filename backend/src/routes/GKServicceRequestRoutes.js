import express from "express"
import{gerAllServices, createServices, updateServices, 
    deleteServices } from "../controllers/GKServiceRequestCtrl.js";
const router = express.Router();

router.get("/", gerAllServices);
router.post("/", createServices);
router.put("/:id", updateServices);
router.delete("/:id", deleteServices);

export default router