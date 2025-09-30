import express from "express";
import multer from "multer";
import {
  getAllServices,
  getMyServices,
  getServicesById,
  createServices,
  updateServices,
  deleteServices,
  assignTechnician,
} from "../controllers/GKServiceRequestCtrl.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Multer setup (in-memory storage for file upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * --- User Routes ---
 */

// Get logged-in user's service requests
router.get("/my", getMyServices);

// Get a service request by ID (owner or admin can view)
router.get("/:id", getServicesById);

// Create a new service request
router.post("/", upload.single("file"), createServices);

// Update a service request (owner or admin only)
router.put("/:id", upload.single("file"), updateServices);

// Delete a service request (owner or admin only)
router.delete("/:id", deleteServices);

/**
 * --- Admin Routes ---
 */

// Get all service requests (admin only)
router.get("/", getAllServices);

// Assign technician to a request (admin only)
router.put("/:id/assign", assignTechnician);

export default router;
