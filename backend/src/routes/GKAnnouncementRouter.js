import express from "express";
import { createAnnouncement, getAnnouncements } from "../controllers/GKAnnouncementCtrl.js";

const router = express.Router();

// Create announcement (admin)
router.post("/", createAnnouncement);

// Get all announcements
router.get("/", getAnnouncements);

export default router;
