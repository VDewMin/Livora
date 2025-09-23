import express from "express"
import{getAllServices, getServicesById, createServices, updateServices, 
    deleteServices, assignTechnician} from "../controllers/GKServiceRequestCtrl.js";
const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getServicesById);
router.post("/", createServices);
router.put("/:id", updateServices);
router.delete("/:id", deleteServices);

//admin
router.put("/:id/assign", assignTechnician);

export default router