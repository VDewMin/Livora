import express from "express";
import { createAnnouncement, getAnnouncements } from "../controllers/GKAnnouncementCtrl.js";

const router = express.Router();

// Create announcement (admin)
router.post("/send", createAnnouncement);

// Get all announcements
router.get("/recive", getAnnouncements);

export default router;
