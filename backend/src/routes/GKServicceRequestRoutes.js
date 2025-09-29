import express from "express";
import multer from "multer";
import{getAllServices, getServicesById, createServices, updateServices, 
    deleteServices, assignTechnician} from "../controllers/GKServiceRequestCtrl.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.get("/", getAllServices);
router.get("/:id", getServicesById);
router.post("/", upload.single("file"), createServices); 
router.put("/:id", upload.single("file"), updateServices);
router.delete("/:id", deleteServices);

//admin
router.put("/:id/assign", assignTechnician);

export default router